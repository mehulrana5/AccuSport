const express = require('express');
const router = express.Router();
const schema = require('./Schema');
const fetchUser = require('./middleware/fetchUser')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const helperFunctions = require("./HelperFunctions")
require('dotenv').config();
const jwtSecret =process.env.JWT_SECRET;

// Register
router.post('/register', async (req, res) => {
    try {
        const { user_name, user_pwd } = req.body;
        const unameExist = await schema.user.findOne({ user_email: user_name })

        if (unameExist) {
            return res.status(400).json({ error: "This email is used" })
        }
        const salt = await bcrypt.genSalt(10);

        const securedPw = await bcrypt.hash(user_pwd, salt);

        const document = new schema.user({
            user_email: user_name,
            user_pwd: securedPw,
            user_role: ["guest"]
        });
        await document.save();
        const data = {
            id: document._id
        }
        const jwtToken = jwt.sign(data, jwtSecret, { expiresIn: '1h' })
        res.status(200).json({ authToken: jwtToken });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { user_email, user_pwd } = req.body;
        const userData = await schema.user.findOne({ user_email: user_email });
        if(userData==null)
            return res.status(400).json({ error: "Incorrect email" });
        const validPw = bcrypt.compare(user_pwd, userData.user_pwd);
        if (validPw) {
            const payload = {
                id: userData._id
            }
            const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '2d' });
            res.json({ jwtToken });
        }
        else {
            return res.status(400).json({ error: "Incorrect credentials" });
        }
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch user data
router.post('/fetchUserData', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;        
        const userData = await schema.user.findById(userId).select('-user_pwd -__v');

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User found", data: userData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete user
router.delete('/deleteUser', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;

        // Check if the user is a team leader
        const teamLeader = await schema.team.findOne({ team_leader: userId });
        if (teamLeader) {
            return res.status(400).json({ error: "User is a team leader and cannot be deleted" });
        }

        // Check if the user is associated with any player profile
        const player = await schema.player.findOne({ user_id: userId });
        if (player) {
            return res.status(400).json({ error: "User is associated with a player profile and cannot be deleted" });
        }

        // Check if the user is a match admin
        const matchAdmin = await schema.match.findOne({ match_admin: userId });
        if (matchAdmin) {
            return res.status(400).json({ error: "User is a match admin and cannot be deleted" });
        }

        // Check if the user is an organizer or match admin in any tournament
        const tournamentAdmin = await schema.tournament.findOne({
            $or: [{ organizer_id: userId }, { match_admins: userId }]
        });
        if (tournamentAdmin) {
            return res.status(400).json({ error: "User is associated with a tournament as an organizer or match admin and cannot be deleted" });
        }

        // Proceed with user deletion
        const user = await schema.user.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create player profile
router.post('/registerPlayer', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id; // Access user ID from req.user
        const { player_name, player_dob } = req.body;

        const playerExists = await schema.player.findOne({ user_id: userId });

        if (playerExists) {
            return res.status(409).json({ error: "Player already created" });
        }

        const playerWithSameName = await schema.player.findOne({ player_name: player_name });
        if (playerWithSameName) {
            return res.status(400).json({ error: "Player name not unique" });
        }

        const document = new schema.player({
            user_id: userId,
            player_name: player_name,
            player_dob: player_dob,
            team_ids: []
        });

        await document.save();

        // Update user's role to include "player" after registering as a player
        await schema.user.updateOne({ _id: userId }, { $push: { user_role: 'player' } });

        res.status(201).json({ error: "Player is created", document }); // Return 201 Created status
    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update player profile
router.put('/updatePlayer', fetchUser, async (req, res) => {
    const userId = req.user_id; // Get authenticated user's ID from req.user
    try {
        // Check if the authenticated user is the owner of the player
        const player = await schema.player.findOne({ user_id: userId });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        // Check if the new player name is unique
        const existingPlayerWithName = await schema.player.findOne({ player_name: req.body.player_name });
        if (existingPlayerWithName && existingPlayerWithName._id.toString() !== userId) {
            return res.status(400).json({ error: 'Player name must be unique' });
        }

        // Update the player
        const updatedPlayer = await schema.player.findOneAndUpdate({ user_id: userId }, req.body, { new: true });

        res.status(200).json(updatedPlayer);
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch multiple player data by userId,name,id,team
router.post('/fetchPlayers', async (req, res) => {
    try {
        const { query, fetchBy } = req.body;
        if (!query || !fetchBy) {
            return res.status(400).json({ error: "Invalid request" });
        }

        let data;

        switch (fetchBy) {
            case "user":
                data = await schema.player.find({ user_id: query });
                break;

            case "name":
                data = await schema.player.findOne({ player_name: query });
                break;

            case "id":
                data = await schema.player.findById(query);
                break;

            case "team":
                data = await schema.player.find({ team_ids: { $in: query } }).select("-user_id");
                break;

            case "teamPlayersNameOnly":
                data = await schema.player.find({ team_ids: { $in: query } }).select("player_name")
                break;

            default:
                return res.status(400).json({ error: "Invalid fetchBy criteria" });
        }

        if (!data) {
            return res.status(404).json({ error: "Could not find the data" });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete player profile
router.delete('/deletePlayer', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;

        // Delete player
        await schema.player.findOneAndDelete({ user_id: userId });

        // Update user's role to remove "player" after deleting player profile
        await schema.user.updateOne({ _id: userId }, { $pull: { user_role: 'player' } });

        // Optionally, you can remove this player from teams they are part of
        await schema.team.updateMany({ team_players_ids: userId }, { $pull: { team_players_ids: userId } });

        res.json({ message: 'Player profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create team
router.post('/createTeam', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;
        const { team_name } = req.body
        // Check if the user has a player id
        const player = await schema.player.findOne({ user_id: userId });
        if (!player) {
            return res.status(400).json({ error: "Only players can create teams" });
        }
        if (team_name.length < 3) {
            return res.status(400).json({ error: "Team Name should be more than 3 characters" });
        }

        // Check if the team name is unique
        const isTeamNameUnique = await schema.team.exists({ team_name: team_name });
        if (isTeamNameUnique) {
            return res.status(400).json({ error: "Not a unique team name" });
        }

        // Create a new team and initialize the team_players_ids with player's ID
        const newTeam = new schema.team({
            team_leader: player._id,
            team_name: team_name,
            team_players_ids: [player._id] // Initialize with player's ID
        });

        // Add "teamLeader" role to the user who created the team
        await schema.user.findOneAndUpdate(
            { _id: userId, user_role: { $nin: ["teamLeader"] } },
            { $push: { user_role: "teamLeader" } }
        );

        // Push the team ID into the team leader's team_ids
        await schema.player.findOneAndUpdate(
            { user_id: userId },
            { $push: { team_ids: newTeam._id } },
            { new: true }
        );

        // Save the new team
        const savedTeam = await newTeam.save();

        res.json(savedTeam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update Team Players of a team with teamId
router.put("/updateTeamPlayers", fetchUser, async (req, res) => {
    try {
        const { team_leader, players, teamId } = req.body;
        const userId = req.user_id;

        // Check if the user is the team leader
        const team = await schema.team.findById(teamId);

        // Fetching corresponding player id from user id
        const playerId = await helperFunctions.getPlayerIdByUserId(userId);

        if (!team || (!team.team_leader.equals(playerId))) {
            return res.status(401).json({ error: "Unauthorized action" });
        }

        // Check if all player IDs are valid
        const playerIds = await schema.player.find({ _id: { $in: players } });

        if (playerIds.length !== players.length) {
            return res.status(400).json({ error: "Some player IDs are invalid" });
        }
        // Check if the team leader is in the team if not then add him
        let flag = false;
        playerIds.forEach(e => {
            if (e._id.equals(team.team_leader)) {
                flag = true;
            }
        });
        if (!flag) {
            const leader = await schema.player.findOne({ _id: team.team_leader }).select("_id")
            players.push(leader._id.toString());
        }

        // Check if the team leader is changed
        const oldTeamLeader = team.team_leader.toString();
        const newTeamLeader = team_leader.toString();
        if (oldTeamLeader !== newTeamLeader) {
            // Check if the new leader id exists
            const isValid = await schema.player.findById(newTeamLeader)
            if (!isValid) {
                return res.status(404).json({ error: "Invalid Leader ID" })
            }
            // Get the number of teams for both old and new leaders
            const [oldLeaderTeams, newLeaderTeams] = await Promise.all([
                schema.team.countDocuments({ team_leader: oldTeamLeader }),
                schema.team.countDocuments({ team_leader: newTeamLeader })
            ]);
            // Removing the team Leader role if the old leader was a leader of only 1 team
            if (oldLeaderTeams <= 1) {
                const oldUid = await schema.player.findById(oldTeamLeader).select("user_id -_id");
                const oldUserId = oldUid.user_id.toString();
                await schema.user.findByIdAndUpdate(oldUserId, { $pull: { user_role: "teamLeader" } }, { new: true });
            }
            // Adding the team leader role to the new leader if he did not have that role
            if (newLeaderTeams <= 1) {
                const newUid = await schema.player.findById(newTeamLeader).select("user_id -_id");
                const newUserId = newUid.user_id.toString();
                await schema.user.findByIdAndUpdate(newUserId, { $push: { user_role: "teamLeader" } }, { new: true });
            }
        }

        // Check if the team is in an ongoing/upcoming match
        const curDate = new Date();
        const matches = await schema.match.find({
            teams: { $in: [teamId] },
            match_end_date_time: { $gte: curDate }
        });

        if (matches.length > 0) {
            return res.status(400).json({ error: "Cannot update the team as it is in an ongoing/upcoming match. The match admin needs to update the match." });
        }

        // Removing the team id from the removed players
        team.team_players_ids.forEach(async (id) => {
            if (!players.includes(id.toString())) {
                await schema.player.findByIdAndUpdate(id, { $pull: { team_ids: team._id } }, { new: true });
            }
        });

        // Adding the team id to the newly added players
        players.forEach(async (player) => {

            if (!team.team_players_ids.includes(player)) {

                await schema.player.findByIdAndUpdate(player, { $push: { team_ids: [team._id] } }, { new: true });

            }
        });

        // Update the team player IDs in the team
        const updatedTeam = await schema.team.findByIdAndUpdate(team._id, { team_players_ids: players, team_leader: newTeamLeader }, { new: true });

        res.status(200).json({ updatedTeam, error: "Team updated" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete team 
router.delete('/deleteTeam', fetchUser, async (req, res) => {
    const { team_id } = req.body;
    const userId = req.user_id;
    try {
        const teamData = await schema.team.findById(team_id);

        const matches = await schema.match.find({ teams: { $in: [team_id] } });

        if (matches.length > 0) {
            return res.status(401).json(
                { error: "Can not delete this team as it is a part of a match that is not over yet.To remove it first ask the match admin to remove this team from the upcoming/ongoing tournament" })
        }

        if (!teamData) {
            return res.status(404).json({ error: "Team not found" });
        }

        // Fetching corresponding player id from user id
        const playerId = await helperFunctions.getPlayerIdByUserId(userId)

        if (!teamData.team_leader.equals(playerId)) {
            return res.status(401).json({ error: "Not authorized for this action" });
        }

        await schema.team.deleteOne({ _id: team_id });

        // Remove team_id from player's team_ids array
        await schema.player.updateMany(
            { team_ids: { $in: [team_id] } },
            { $pull: { team_ids: team_id } }
        );

        // Remove teamLeader role from player if no team available 
        const checkLeader = await schema.player.findById(playerId).select("team_ids");

        if (checkLeader && checkLeader.team_ids.length <= 0) {
            await schema.user.findByIdAndUpdate(userId, { $pull: { user_role: 'teamLeader' } }, { new: true });
        }

        res.status(200).json({ error: "Deleted the team" });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch team by name or user ID
router.post('/fetchTeam', async (req, res) => {
    try {
        const { query, fetchBy } = req.body;

        let data;

        switch (fetchBy) {
            case "user":
                data = await schema.team.find({ team_leader: query }).select("-team_leader -__v -team_players_ids");
                break;
            case "id":
                data = await schema.team.findById(query);
                break;
            case "name":
                data = await schema.team.find({ team_name: query });
                break;
            default:
                return res.status(400).json({ error: "Invalid criteria" });
        }

        if (!data) {
            return res.status(404).json({ error: "Could not find the data" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create tournament
router.post('/createTournament', fetchUser, async (req, res) => {
    try {
        const { tournament_name, sport_type, start_date_time, description, match_admins } = req.body;
        const userId = req.user_id;

        const playerId = await helperFunctions.getPlayerIdByUserId(userId)

        const CheckTorName = await schema.tournament.exists({ tournament_name: tournament_name })

        if (CheckTorName) {
            return res.status(400).json({ error: "Not a unique tournament name" })
        }

        //users who have player role can become match admins only

        const validAdmins = await schema.player.find({ _id: { $in: match_admins } })

        if (validAdmins.length !== match_admins.length) {
            return res.status(400).json({ error: "Not all match admin IDs are valid" });
        }

        // Add the organizer's ID as the default match admin
        const document = new schema.tournament({
            tournament_name: tournament_name,
            tournament_status: "upcoming",
            sport_type: sport_type,
            start_date_time: start_date_time,
            description: description,
            organizer_id: playerId,
            match_admins: match_admins // Add the organizer as a match admin
        });

        await document.save();
        res.status(201).json({ error: "Tournament created", document });
    } catch (error) {
        console.error('Error adding tournament:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update tournament (status,start date-time, description, match admins)
router.put('/updateTournament/:tournamentId', fetchUser, async (req, res) => {
    try {
        const tournamentId = req.params.tournamentId;
        const userId = req.user_id;
        const {
            tournament_status,
            start_date_time,
            description,
            match_admins,
        } = req.body;
        const tournament = await schema.tournament.findById(tournamentId);
        //Check if tournament exist or not
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }
        //Check if user is authorized or not
        const playerId = await helperFunctions.getPlayerIdByUserId(userId)
        if (!tournament.organizer_id.equals(playerId)) {
            return res.status(401).json({ error: "Not authorized for this action" });
        }
        //Check if match admin ids exist or not
        const checkAdmins = await schema.player.find({ _id: { $in: match_admins } });
        if (checkAdmins.length !== match_admins.length) {
            return res.status(400).json({ error: "Enter correct Match Admin ids" });
        }
        const updatedMatchAdmins = tournament.organizer_id.equals(playerId)
            ? match_admins.includes(tournament.organizer_id.toString())
                ? match_admins
                : [...match_admins, tournament.organizer_id]
            : match_admins;

        if (!["old", "ongoing", "upcoming"].includes(tournament_status)) {
            return res.status(400).json({ error: "Invalid tournament status" });
        }
        //Valid status transition
        const validTransitions = {
            upcoming: ["ongoing", "upcoming"],
            ongoing: ["old", "ongoing"],
            old: ["old"],
        };
        // Check if the requested transition is valid
        if (!validTransitions[tournament.tournament_status].includes(tournament_status)) {
            return res.status(400).json({
                error: "Invalid tournament status transition",
            });
        }
        //Check status from upcoming to ongoing
        if (tournament_status === "ongoing" && tournament.tournament_status === "upcoming") {
            const startDate = new Date(tournament.start_date_time);
            const curDate = new Date();
            if (startDate >= curDate) {
                return res.status(400).json({
                    error: `The tournament updated status is invalid \ntoday:${curDate.toLocaleString()} \nstart date:${startDate.toLocaleString()}`,
                });
            }
        }
        //Check status from ongoing to old
        if (tournament_status === "old" && tournament.tournament_status === "ongoing") {
            const matches = await schema.match.find({ tournament_id: tournament._id });
            const minEnd = matches.reduce((min, match) => {
                const temp = new Date(match.match_end_date_time);
                return min > temp ? min : temp;
            }, new Date());
            const curDate = new Date();

            if (curDate < minEnd) {
                return res.status(400).json({
                    error: `The tournament updated status is invalid \ntoday:${curDate.toLocaleString()} \nmininum-end-date:${minEnd.toLocaleString()}`,
                });
            }
        }
        // Check the range for setting a new start date of the tournament
        const updatedDate = new Date(start_date_time);
        if (updatedDate.getTime() !== tournament.start_date_time.getTime()) {
            const minStartMatch = await schema.match.aggregate([
                { $match: { tournament_id: tournament._id } },
                { $group: { _id: null, minStart: { $min: "$match_start_date_time" } } }
            ]).exec();
            console.log(minStartMatch[0].minStart.toLocaleString());
            if (minStartMatch.length > 0) {
                const minStart = minStartMatch[0].minStart;
                if (updatedDate > minStart || updatedDate < new Date()) {
                    const minStartDateString = minStart.toLocaleString();
                    return res.status(400).json({ error: `The tournament updated status is invalid. Start Date Range\n${new Date().toLocaleString()} - ${minStartDateString}` });
                }
            }
        }
        const updatedTournament = await schema.tournament.findByIdAndUpdate(
            tournamentId,
            {
                tournament_status,
                start_date_time,
                description,
                match_admins: updatedMatchAdmins,
            },
            { new: true }
        );
        return res.status(200).json({ updatedTournament, error: "Tournament updated" });
    }
    catch (error) {
        console.error('Error updating tournament:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch a tournament by name or ID
router.post('/fetchTournament', async (req, res) => {
    try {
        const { query, fetchBy } = req.body;

        let tournament;

        switch (fetchBy) {
            case "id":
                tournament = await schema.tournament.findOne({ _id: query });
                break;
            case "org":
                tournament = await schema.tournament.find({ organizer_id: query });
                break;
            case "status":
                tournament = await schema.tournament.find({ tournament_status: query });
                break;
            case "name":
                tournament = await schema.tournament.find({ tournament_name: query });
                break;
            default:
                break;
        }

        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }

        res.status(200).json(tournament);

    } catch (error) {
        console.error('Error fetching tournament:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a tournament
router.delete('/deleteTournament', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;
        const tournamentId = req.body.tournamentId;

        const tournament = await schema.tournament.findById(tournamentId);

        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }

        const playerId = await helperFunctions.getPlayerIdByUserId(userId);

        if (!tournament.organizer_id.equals(playerId)) {
            return res.status(401).json({ error: "Not authorized for this action" });
        }

        // Check if there are any matches associated with this tournament
        const matchesWithTournament = await schema.match.exists({ tournament_id: tournamentId });
        if (matchesWithTournament) {
            return res.status(400).json({ error: "Cannot delete tournament with associated matches" });
        }

        await schema.tournament.findByIdAndDelete(tournamentId);

        res.json({ error: "Tournament deleted successfully" });
    } catch (error) {
        console.error('Error deleting tournament:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create match
router.post('/createMatch', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;
        const { tournament_id, match_start_date_time, match_end_date_time, description, teams, OLC } = req.body;

        const tournament = await schema.tournament.findById(tournament_id);

        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }

        // if(tournament.tournament_status!=='upcoming'){
        //     return res.status(400).json({error:"You can only add Matches to upcoming tournaments only"})
        // }

        const playerId = await helperFunctions.getPlayerIdByUserId(userId)

        if (!tournament.match_admins.includes(playerId)) {
            return res.status(401).json({ error: `Not authorized for creating a match under this tournament ask for access from the tournament admin of tournament ${tournament._id} ` });
        }

        const matchStartDateTime = new Date(match_start_date_time);
        const matchEndDateTime = new Date(match_end_date_time);

        if (matchStartDateTime <= tournament.start_date_time) {
            return res.status(400).json({ error: `Match start date must be ahead of the tournament start date: ${tournament.start_date_time.toLocaleString()}` });
        }

        if (matchEndDateTime <= matchStartDateTime) {
            return res.status(400).json({ error: "Match end date must be after the start date" });
        }

        const teamsExist = await schema.team.find({ _id: { $in: teams } });

        if (teamsExist.length !== teams.length) {
            return res.status(400).json({ error: "One or more provided team IDs do not exist" });
        }

        // Check if a player is in more than one team in this match
        for (let i = 0; i < teamsExist.length; i++) {
            const t1 = teamsExist[i].team_players_ids;
            for (let j = i + 1; j < teamsExist.length; j++) {
                for (const e of t1) {
                    if (teamsExist[j].team_players_ids.includes(e)) {
                        return res.status(400).json({ error: `player ${e} is in more than one team in this match` });
                    }
                }
            }
        }

        const teamsAlreadyInMatches = await schema.match.find({
            tournament_id: tournament_id,
            teams: { $in: teams }
        });
        if (teamsAlreadyInMatches.length > 0) {
            return res.status(400).json({ error: "Some teams are already part of matches in this tournament" });
        }

        //Check if the venue where match taking place is occupied or not during that time
        const matchesAtGivenVenue = await schema.match.aggregate([
            {
                $match: {
                    OLC: OLC,
                    $or: [
                        {
                            match_start_date_time: {
                                $gte: new Date(match_start_date_time),
                                $lte: new Date(match_end_date_time)
                            }
                        },
                        {
                            match_end_date_time: {
                                $gte: new Date(match_start_date_time),
                                $lte: new Date(match_end_date_time)
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    // match_start_date_time: 1,
                    // match_end_date_time: 1,
                    // Add other fields you want to include
                }
            }
        ]);

        // console.log(matchesAtGivenVenue);

        if (matchesAtGivenVenue.length > 0) {
            return res.status(400).json({ error: "Change the timings as this venue is occupied within this time frame" })
        }

        const newMatch = new schema.match({
            tournament_id: tournament_id,
            match_start_date_time: match_start_date_time,
            match_end_date_time: match_end_date_time,
            description: description,
            teams: teams,
            OLC: OLC,
            match_status: "upcoming"
        });

        await newMatch.save();

        res.status(200).json({ error: "match created!!" });
    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update match
router.put('/updateMatch', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;
        const { matchId, match_start_date_time, match_end_date_time, description, match_status } = req.body;

        // Find the existing match by ID
        const existingMatch = await schema.match.findById(matchId);

        // Check if the match exists
        if (!existingMatch) {
            return res.status(404).json({ error: "Match not found" });
        }

        // Find the associated tournament to check if the user is a match admin
        const associatedTournament = await schema.tournament
            .findById(existingMatch.tournament_id)
            .select('match_admins');

        // Check if the user is authorized as a match admin
        const playerId = await helperFunctions.getPlayerIdByUserId(userId)
        if (!associatedTournament.match_admins.includes(playerId)) {
            return res.status(401).json({ error: "Not authorized for this action" });
        }

        // Checking and updating the match status
        if (match_status !== existingMatch.match_status) {
            const validStatuses = ["old", "ongoing", "upcoming"];
            if (!validStatuses.includes(match_status)) {
                return res.status(400).json({ error: "Invalid match status" });
            }

            // Define valid status transitions
            const validTransitions = {
                upcoming: ["ongoing", "upcoming"],
                ongoing: ["old", "ongoing"],
                old: ["old"],
            };

            // Check if the requested transition is valid
            if (!validTransitions[existingMatch.match_status].includes(match_status)) {
                return res.status(400).json({ error: "Invalid match status transition" });
            }

            const curDate = new Date();
            // console.log(curDate,new Date(match_start_date_time));

            // Check if status is going from upcoming to ongoing then the start date time should be correct
            if (match_status === 'ongoing' && curDate < new Date(match_start_date_time)) {
                return res.status(400).json({ error: "Match can not be started before match start date time" })
            }
            // Check if status is going from ongoing to old then the end date time should be correct
            if (match_status === 'old' && curDate < new Date(match_end_date_time)) {
                return res.status(400).json({ error: "Match can not be ended before match end date time" })
            }

            // Update the match status
            existingMatch.match_status = match_status;
        }

        // Check and update the match start date
        if (match_start_date_time) {
            const updatedStartDate = new Date(match_start_date_time);
            if (updatedStartDate <= associatedTournament.start_date_time) {
                return res.status(400).json({ error: "Match start date must be ahead of the tournament start date" });
            }
            existingMatch.match_start_date_time = updatedStartDate;

            // Check and update the match end date if provided
            if (match_end_date_time) {
                const updatedEndDate = new Date(match_end_date_time);
                if (updatedEndDate <= updatedStartDate) {
                    return res.status(400).json({ error: "Match end date must be after the start date" });
                }
                existingMatch.match_end_date_time = updatedEndDate;
            }
        }

        // Update the match description if provided
        if (description !== undefined) {
            existingMatch.description = description;
        }

        //Update match
        const match = await schema.match.findByIdAndUpdate(matchId, existingMatch, { new: true });

        res.status(200).json({ error: "Match updated", match });
    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch matches
router.post('/fetchMatches', async (req, res) => {
    try {
        const { query, fetchBy } = req.body;

        let data;

        switch (fetchBy) {
            case "tour":
                data = await schema.match.find({ tournament_id: query });
                break;

            case "team":
                data = await schema.match.find({ teams: { $in: [query] } });
                break;

            case "player":
                const data1 = await schema.player.findById(query);
                if (data1) {
                    data = await schema.match.find({ teams: { $in: data1.team_ids } });
                } else {
                    return res.status(404).json({ error: 'Player not found' });
                }
                break;

            case "id":
                data = await schema.match.findById(query);
                break;

            default:
                break;
        }
        if (!data) {
            return res.status(404).json({ error: "Could not fetch the matches" });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete match
router.delete("/deleteMatch/:matchId", fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;
        const matchId = req.params.matchId;

        const match = await schema.match.findById(matchId);

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }

        const playerId = await helperFunctions.getPlayerIdByUserId(userId);

        if (!match.match_admin.equals(playerId)) {
            return res.status(401).json({ error: "Not authorized for this action" });
        }

        //check if the tournament is upcoming or not

        await schema.match.findByIdAndDelete(matchId);

        res.status(200).json({ message: "Match deleted" });
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create data points
router.post('/createDataPoints', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;

        const { tournament_id, performance_metrics } = req.body;

        // Check if the user is the tournament organizer or a match admin for the specified tournament
        const tournament = await schema.tournament.findById(tournament_id);

        if (!tournament) {
            return res.status(404).json({ error: 'Tournament not found' });
        }

        const playerId = await helperFunctions.getPlayerIdByUserId(userId);

        if (!(tournament.organizer_id.equals(playerId) || tournament.match_admins.includes(playerId))) {
            return res.status(401).json({ error: 'Not authorized for this action' });
        }

        // Create a new data points data document
        const newDataPoints = new schema.dataPoints({
            tournament_id: tournament_id,
            performance_metrics: performance_metrics
        });
        await newDataPoints.save();

        res.status(200).json({ error: 'Data points created' });
    } catch (error) {
        console.error('Error creating data points:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update data points
router.put("/updateDataPoints", fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;

        const { tournament_id, performance_metrics } = req.body;

        // Check if the user is the tournament organizer or a match admin for the specified tournament
        const tournament = await schema.tournament.findById(tournament_id);

        if (!tournament) {
            return res.status(404).json({ error: 'Tournament not found' });
        }

        const playerId = await helperFunctions.getPlayerIdByUserId(userId);

        if (!(tournament.organizer_id.equals(playerId) || tournament.match_admins.includes(playerId))) {
            return res.status(401).json({ error: 'Not authorized for this action' });
        }

        //check if the tournament is ongoing
        if (tournament.tournament_status !== "upcoming") {
            return res.status(400).json({ error: "Can not update the data points if tournament status is not upcoming" })
        }

        // Find and update the data points
        const updatedDataPoints = await schema.dataPoints.findOneAndUpdate(
            { tournament_id: tournament_id },
            { performance_metrics },
            { new: true }
        );

        if (!updatedDataPoints) {
            return res.status(404).json({ error: 'Data points not found' });
        }

        return res.status(200).json({ error: 'Data points updated' });
    } catch (error) {
        console.error('Error updating data points:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch data points 
router.post("/fetchDataPoints", async (req, res) => {
    try {
        const { tournament_id } = req.body;
        const dataPoints = await schema.dataPoints.findOne({ tournament_id: tournament_id });

        if (!dataPoints) {
            return res.status(404).json({ error: "Data points not found" });
        }

        res.status(200).json(dataPoints);
    } catch (error) {
        console.error('Error fetching data points:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete data points 

//Create a performance record
router.post("/createPerformanceRecord", fetchUser, async (req, res) => {
    try {
        const userId = req.user_id

        const { tournament_id, match_id, team_id, player_id, performance_metrics } = req.body;

        const tournament = await schema.tournament.findById(tournament_id);
        //check for tournament
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }
        //check the match admins
        const playerId = await helperFunctions.getPlayerIdByUserId(userId);

        if (!(tournament.match_admins.includes(playerId))) {
            return res.status(401).json({ error: 'Not authorized for this action' });
        }
        const match = await schema.match.findById(match_id);
        //check for match
        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }
        //check if match ongoing
        if (match.match_status !== 'ongoing') {
            return res.status(400).json({ error: "Match status not ongoing" });
        }
        //check team
        if (team_id !== undefined) {
            if (!match.teams.includes(team_id)) {
                return res.status(400).json({ error: "Team not part of this match" });
            }
        }
        //check player
        if (player_id !== undefined) {
            const team = await schema.team.findById(team_id).select("team_players_ids")
            if (!team.team_players_ids.includes(player_id)) {
                return res.status(400).json({ error: "Player not in this team" });
            }
        }

        const document = new schema.performanceRecord({
            tournament_id: tournament_id,
            match_id: match_id,
            team_id: team_id,
            player_id: player_id,
            performance_metrics: performance_metrics
        })

        await document.save();
        res.status(200).json({ error: 'performance data set created and stored' });
    } catch (error) {

    }
})

// Update a performance record

//Fetch a performance record
router.post("/fetchPerformanceRecord", async (req, res) => {
    try {
        const { tournament_id, match_id, team_id, player_id } = req.body;

        // Create a query object based on the provided parameters
        const query = {
            tournament_id,
            match_id,
            team_id,
        };

        // Include player_id in the query only if it is not null
        if (player_id !== null) {
            query.player_id = player_id;
        }

        // Use the query object in the find method
        const data = await schema.performanceRecord.find(query).select("performance_metrics");
        if (!data) {
            return res.status(404).json({ error: "No record found" })
        }

        // Respond with the fetched data
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a performance record

// Create notification
const notification_meta_data = {
    'types': ['user', 'player', 'team', 'match', 'tournament'],
    'user': ["player-profile-created"],
    'player': ["request-to-join"],
    'team': ['added-to-team', 'removed-from-team'],
    'match': ['venue-updated', 'teams-updated', 'time-updated'],
    'tournament': ['match-admin-update', 'tournament-time-updated']
}

// Create notification
router.post("/createNotification", fetchUser, async (req, res) => {
    try {
        const userId = req.user_id
        const playerId = await helperFunctions.getPlayerIdByUserId(userId)
        const { user_ids, player_ids, team_ids, match_ids, tournament_ids, type, subtype, extra_data } = req.body
        let temp = {
            'sender': playerId,
            'receivers': {},
            'type': `${type}-${subtype}`
        }
        if (!notification_meta_data['types'].includes(type) || !notification_meta_data[type].includes(subtype)) {
            return res.status(400).json({ error: "Incorrect type or subtype" });
        }
        if (user_ids.length) {
            const users = await schema.user.find({ _id: { $in: user_ids } }).select("_id")
            if (users.length != user_ids.length) {
                return res.status(400).json({ error: "The user ids are incorrect" })
            }
            temp.receivers['users'] = user_ids
        }
        if (player_ids.length) {
            const players = await schema.player.find({ _id: { $in: player_ids } }).select("_id")
            if (players.length != player_ids.length) {
                return res.status(400).json({ error: "The player ids are incorrect" })
            }
            temp.receivers['players'] = player_ids
        }
        if (team_ids.length) {
            const teams = await schema.team.find({ _id: { $in: team_ids } }).select("_id")
            if (teams.length != team_ids.length) {
                return res.status(400).json({ error: "The team ids are incorrect" })
            }
            temp.receivers['teams'] = team_ids
        }
        if (match_ids.length) {
            const matches = await schema.match.find({ _id: { $in: match_ids } }).select("_id")
            if (matches.length != match_ids.length) {
                return res.status(400).json({ error: "The match ids are incorrect" })
            }
            temp.receivers['matches'] = match_ids
        }
        if (tournament_ids.length) {
            const tournaments = await schema.match.find({ _id: { $in: tournament_ids } }).select("_id")
            if (tournaments.length != tournament_ids.length) {
                return res.status(400).json({ error: "The tournament ids are incorrect" })
            }
            temp.receivers['tournament'] = tournament_ids
        }
        switch (type) {
            case 'user':
                if (subtype == 'request-to-join' && !!extra_data?.player_name) {
                    temp['message'] = `${extra_data?.player_name} profile is created`
                }
                else {
                    return res.status(400).json({ error: `${type}-${subtype} not found or maybe required extra data is not present` })
                }
                break;

            case 'player':
                if (subtype == 'request-to-join' && !!extra_data?.team_name) {
                    temp['message'] = `You sent join request to team ${extra_data?.team_name}`
                }
                else {
                    return res.status(400).json({ error: `${type}-${subtype} not found or maybe required extra data is not present` })
                }
                break;

            case 'team':
                if (subtype == 'added-to-team' && !!extra_data?.team_name && !!extra_data?.added_player_name) {
                    temp['message'] = `Player ${extra_data?.player_name} is added to team ${extra_data?.team_name}`
                }
                else if (subtype == 'removed-from-team' && !!extra_data?.team_name && !!extra_data?.removed_player_name) {
                    temp['message'] = `Player ${extra_data?.removed_player_name} is removed from team ${extra_data?.team_name}`
                }
                else {
                    return res.status(400).json({ error: `${type}-${subtype} not found or maybe required extra data is not present` })
                }
                break;

            case 'match':
                if (subtype == 'venue-updated' && !!extra_data?.match_id && !!extra_data?.venue) {
                    temp['message'] = `Venue updated to ${extra_data?.venue} of match ${extra_data?.match_id}`
                }
                else if (subtype == 'teams-updated' && !!extra_data?.team_names) {
                    temp['message'] = `Teams set for match ${extra_data?.match_id} are ${extra_data?.teams}`
                }
                else if (subtype == 'time-updated' && !!extra_data?.match_timnigs) {
                    temp['message'] = `Match timing updated to ${extra_data?.match_timnigs}`
                }
                else {
                    return res.status(400).json({ error: `${type}-${subtype} not found or maybe required extra data is not present` })
                }
                break;

            case 'tournament':
                if (subtype == 'match-admin-update' && !!extra_data?.match_admins) {
                    temp['message'] = `Update in tournament's match admins ${extra_data?.matchAdmin}`
                }
                else if (subtype == 'tournament-time-updated' && !!extra_data?.tournament_time) {
                    temp['message'] = `Tournament's time updated to ${extra_data?.tournament_time}`
                }
                else {
                    return res.status(400).json({ error: `${type}-${subtype} not found or maybe required extra data is not present` })
                }
                break;

            default:
                break;
        }
        const document = new schema.notification(temp)
        await document.save()
        return res.json("done")
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

// Update notification
// Do we even need this ?

// Read notification
router.get("/fetchNotifications", fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;
        const playerId = await helperFunctions.getPlayerIdByUserId(userId);
        const playerData = await schema.player.findById(playerId).select("team_ids -_id");
        const teamIds = playerData.team_ids;
        const matches = await schema.match.find({teams: { $in: teamIds }}).select("_id");
        console.log(matches);
        
        // Query to find relevant notifications
        const myNotifications = await schema.notification.find({
            $or: [
                { "receivers.users": userId },
                { "receivers.players": playerId },
                { "receivers.teams": { $in: teamIds } },
                { "receivers.matches": { $in: teamIds } }
            ]
        });
        // console.log(userId, playerId, teamIds);
        res.json(myNotifications);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
// Delete notification
module.exports = router;