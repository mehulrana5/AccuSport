const express = require('express');
const router = express.Router();
const schema = require('./Schema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fetchUser = require('./middleware/fetchUser')
// require('dotenv').config({ path: '/SecretKey.env' });
// const jwtSecret = process.env.JWT_SECRET;
const jwtSecret = "mehul123";

//register
router.post('/register', async (req, res) => {
    // console.log('Request Body:', req.body);
    try {
        const unameExist = await schema.user.findOne({ user_email: req.body.user_email })
        if (unameExist) {
            return res.status(400).json({ error: "This email is used" })
        }
        const salt = await bcrypt.genSalt(10);

        const securedPw = await bcrypt.hash(req.body.user_pwd, salt);

        const document = new schema.user({
            user_email: req.body.user_email,
            user_pwd: securedPw,
            user_role: ["guest"]
        });
        await document.save();
        // console.log('Added a new user:', document);
        const data = {
            id: document._id
        }
        const jwtToken = jwt.sign(data, jwtSecret, { expiresIn: '1h' })

        // console.log(jwtToken);
        res.status(200).json({ authToken: jwtToken });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//login  
router.post('/login', async (req, res) => {
    try {
        const { user_email, user_pwd } = req.body;
        const userData = await schema.user.findOne({ user_email: user_email });

        const validPw = await bcrypt.compare(user_pwd, userData.user_pwd);
        if (validPw) {
            const payload = {
                id: userData._id
            }
            const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' })
            res.json({ jwtToken })
        }
        else {
            return res.status(400).json({ error: "incorrect credentials" })
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

//delete user
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

//Create player profile
router.post('/registerPlayer', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id; // Access user ID from req.user
        const { player_name, player_dob } = req.body; // Get player_name and player_dob from request body

        const playerExists = await schema.player.findOne({ user_id: userId });

        if (playerExists) {
            return res.status(409).json({ error: "Player already created" });
        }

        const playerWithSameName = await schema.player.findOne({ player_name: player_name });
        if (playerWithSameName) {
            return res.status(400).json({ error: "Player name not unique" });
        }

        const document = new schema.player({
            user_id: userId, // Assign the user ID to the player's user_id field
            player_name: player_name,
            player_dob: player_dob,
            team_ids: [] // Initialize team_ids as an empty array
        });

        await document.save();

        // Update user's role to include "player" after registering as a player
        await schema.user.updateOne({ _id: userId }, { $push: { user_role: 'player' } });

        res.status(201).json(document); // Return 201 Created status
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

//fetch multiple player data by userId,name,id,team
router.post('/fetchPlayers', async (req, res) => {

    console.log(req.body);

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
                data = await schema.player.find({ team_ids: { $in: query } });
                break;

            case "teamPlayersNameOnly":
                data=await schema.player.find({team_ids:{$in:query}}).select("player_name -_id")
                break;

            default:
                return res.status(400).json({ error: "Invalid fetchBy criteria" });
        }

        if (!data) {
            return res.status(404).json({ error: "Could not find the data" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete player profile
router.delete('/deletePlayer', fetchUser, async (req, res) => {
    const userId = req.user_id;
    try {
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

//create team
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
            team_leader: userId,
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

//update Team Players of a team with teamId
router.put("/updateTeamPlayers", fetchUser, async (req, res) => {
    try {
        const { players, teamId } = req.body;
        const userId = req.user_id;

        // Check if the user is the team leader
        const team = await schema.team.findById(teamId);

        if (!team || !team.team_leader.equals(userId)) {
            return res.status(401).json({ error: "Unauthorized action" });
        }

        // Check if all player IDs are valid
        const playerIds = await schema.player.find({ _id: { $in: players } });

        if (playerIds.length !== players.length) {
            return res.status(400).json({ error: "Some player IDs are not valid" });
        }
        //Check if the team leader is in the team if not then add him
        let flag=false;
        playerIds.forEach(e => {
            if(e.user_id.equals(team.team_leader)){
                flag=true;
            }
        });
        if(!flag){
            const leader=await schema.player.findOne({user_id:team.team_leader}).select("_id")
            players.push(leader._id.toString());
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
                
                const check=await schema.player.findByIdAndUpdate(id, { $pull: { team_ids: team._id } }, { new: true });
                
                // console.log(check);
            }
        });

        // Adding the team id to the newly added players
        players.forEach(async (player) => {

            if (!team.team_players_ids.includes(player)) {

                const check=await schema.player.findByIdAndUpdate(player, { $push: { team_ids: [team._id] } }, { new: true });

                // console.log(check); 
            }
        });

        // Update the team player IDs in the team
        const updatedTeam = await schema.team.findByIdAndUpdate(team._id, { team_players_ids: players }, { new: true });

        res.status(200).json({updatedTeam,error:"Team updated"}); 
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//delete team 
router.delete('/deleteTeam', fetchUser, async (req, res) => {
    const { team_id } = req.body;
    const userId = req.user_id;
    try {
        const teamData = await schema.team.findById(team_id);

        const matches = await schema.match.find({ teams: { $in: [team_id] } });

        if (matches.length>0) {
            return res.status(401).json(
                { error: "Can not delete this team as it is a part of a match that is not over yet.To remove it first ask the match admin to remove this team from the upcoming/ongoing tournament" })
        }

        if (!teamData) {
            return res.status(404).json({ error: "Team not found" });
        }

        if (!teamData.team_leader.equals(userId)) {
            return res.status(401).json({ error: "Not authorized for this action" });
        }

        await schema.team.deleteOne({ _id: team_id });

        // Remove team_id from player's team_ids array
        await schema.player.updateMany(
            { team_ids: { $in: [team_id] } },
            { $pull: { team_ids: team_id } }
        );

        const checkLeader = await schema.player.findOne({ user_id: userId });

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

        const CheckTorName = await schema.tournament.exists({ tournament_name: tournament_name })

        if (CheckTorName) {
            return res.status(400).json({ error: "Not a unique tournament name" })
        }

        const validAdmins = await schema.user.find({ _id: { $in: match_admins } })

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
            organizer_id: userId,
            match_admins: match_admins // Add the organizer as a match admin
        });

        await document.save();
        res.json(document);
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

        //Check if user if authorized or not

        if (!tournament.organizer_id.equals(userId)) {
            return res.status(401).json({ error: "Not authorized for this action" });
        }

        //Check if match admin ids exist or not

        const checkAdmins = await schema.user.find({ _id: { $in: match_admins } });

        if (checkAdmins.length !== match_admins.length) {
            return res.status(400).json({ error: "Enter correct Match Admin ids" });
        }

        const updatedMatchAdmins = tournament.organizer_id.equals(userId)
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

        //Check status from ondoing to old

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

        //Check the range for setting a new start date of the tournament

        if (start_date_time !== tournament.start_date_time) {
            const matches = await schema.match.find({ tournament_id: tournament._id });
            const minStart = matches.reduce((min, match) => {
                const temp = new Date(match.match_start_date_time);
                return min > temp ? min : temp;
            }, new Date());

            if (start_date_time > minStart) {
                return res.status(400).json({
                    error: `The tournament updated status is invalid \ntoday:${curDate.toLocaleString()} \maximum-start-date:${minEnd.toLocaleString()}`,
                });
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

        res.status(200).json({updatedTournament,error:"tournament updated"});
    } catch (error) {
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

        if (!tournament.organizer_id.equals(userId)) {
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

//create match
router.post('/createMatch', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;
        const { tournament_id, match_start_date_time, match_end_date_time, description, teams, OLC } = req.body;

        // Use findById to find the tournament by its _id
        const tournament = await schema.tournament.findById(tournament_id);

        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }

        if (!tournament.match_admins.includes(userId)) {
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

        const teamsAlreadyInMatches = await schema.match.find({
            tournament_id: tournament_id,
            teams: { $in: teams }
        });

        if (teamsAlreadyInMatches.length > 0) {
            return res.status(400).json({ error: "Some teams are already part of matches in this tournament" });
        }

        const newMatch = new schema.match({
            tournament_id: tournament_id,
            match_start_date_time: match_start_date_time,
            match_end_date_time: match_end_date_time,
            description: description,
            teams: teams,
            OLC: OLC
        });

        await newMatch.save();

        res.status(200).json({ message: "match created!!" });
    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//update match
router.put('/updateMatch/:match_id', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;
        const matchId = req.params.match_id;
        const { match_start_date_time, match_end_date_time, description } = req.body;
        const oldMatch = await schema.match.findById(matchId);

        if (!oldMatch) {
            return res.status(404).json({ error: "Match not found" });
        }

        if (!oldMatch.match_admin.equals(userId)) {
            return res.status(401).json({ error: "Not authorized for this action" });
        }

        // Check if the updated match start date is valid
        if (match_start_date_time) {
            const tournament = await schema.tournament.findById(oldMatch.tournament_id);
            const updatedMatchStartDateTime = new Date(match_start_date_time);

            if (updatedMatchStartDateTime <= tournament.start_date_time) {
                return res.status(400).json({ error: "Match start date must be ahead of the tournament start date" });
            }
            // Check if the match end date is valid
            oldMatch.match_start_date_time = updatedMatchStartDateTime;
            if (match_end_date_time) {
                const updatedMatchEndDateTime = new Date(match_end_date_time);
                if (updatedMatchEndDateTime <= updatedMatchStartDateTime) {
                    return res.status(400).json({ error: "Match end date must be after the start date" });
                }
                oldMatch.match_end_date_time = updatedMatchEndDateTime;
            }
        }

        // Update the match data if needed (e.g., description)
        if (description !== undefined) {
            oldMatch.description = description;
            await oldMatch.save();
        }

        res.status(200).json(oldMatch);
    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//fetch matches of a tournament //by tour,id,team id,player
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

//delete match
router.delete("/deleteMatch/:matchId", fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;
        const matchId = req.params.matchId;

        const match = await schema.match.findById(matchId);

        if (!match) {
            return res.status(404).json({ error: "Match not found" });
        }

        if (!match.match_admin.equals(userId)) {
            return res.status(401).json({ error: "Not authorized for this action" });
        }

        await schema.match.findByIdAndDelete(matchId);

        res.status(200).json({ message: "Match deleted" });
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
