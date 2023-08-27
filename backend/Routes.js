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
        const unameExist = await schema.user.findOne({ user_name: req.body.user_name })
        if (unameExist) {
            return res.status(400).json("user name not unique")
        }
        const salt = await bcrypt.genSalt(10);

        const securedPw = await bcrypt.hash(req.body.user_pwd, salt);

        const document = new schema.user({
            user_name: req.body.user_name,
            user_pwd: securedPw,
            user_role: ["guest"]
        });
        await document.save();
        // console.log('Added a new user:', document);
        const data = {
            id: document._id
        }
        const jwtToken = jwt.sign(data, jwtSecret, { expiresIn: '1h' })

        console.log(jwtToken);

        res.json({ jwtToken });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//login
router.post('/login', async (req, res) => {
    try {
        const { user_name, user_pwd } = req.body;
        const userData = await schema.user.findOne({ user_name: user_name });

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

// Fetch a Player profile by name or user ID
router.post('/fetchPlayerProfile', async (req, res) => {
    const { query } = req.body;
    try {
        // Check if the query is a valid ObjectId (user ID)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);

        let player;

        if (isObjectId) {
            // Fetch player profile by user ID
            player = await schema.player.findOne({ _id: query });
        } else {
            // Fetch player profile by player name
            player = await schema.player.findOne({ player_name: query });
        }

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        } else {
            return res.status(200).json(player);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching player profile' });
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

//add player to a team with teamId
router.put('/addPlayerToTeam', fetchUser, async (req, res) => {
    const { player_id, team_id } = req.body;
    const userId = req.user_id;
    try {
        // Check if the player with player_id exists
        const playerExists = await schema.player.exists({ _id: player_id });
        if (!playerExists) {
            return res.status(400).json({ error: "Player does not exist" });
        }

        // Find the team
        const teamData = await schema.team.findById(team_id);

        // Check if team exists
        if (!teamData) {
            return res.status(404).json({ error: "Team not found" });
        }

        // Check if the player is already in the team
        if (teamData.team_players_ids.includes(player_id)) {
            return res.status(400).json({ error: "Player is already in the team" });
        }

        // Check if the authenticated user is the team leader
        if (!teamData.team_leader.equals(userId)) {
            return res.status(401).json({ error: "Not authorized for this action" });
        }

        // Update the team's player list and the player's team_ids
        await schema.team.findByIdAndUpdate(team_id, { $push: { team_players_ids: player_id } });
        await schema.player.findByIdAndUpdate(player_id, { $push: { team_ids: team_id } });

        res.json({ message: "Player added to the team successfully" });
    } catch (error) {
        console.error('Error adding player to team:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//remove player from the team using team id
router.put('/removePlayerFromTeam', fetchUser, async (req, res) => {
    const { team_id, player_id } = req.body;
    const user_id = req.user_id;

    try {
        // Check if player exists
        const playerExists = await schema.player.exists({ _id: player_id });
        if (!playerExists) {
            return res.status(400).json({ error: "Player does not exist" });
        }

        // Check if player exists in the team    
        const teamData = await schema.team.findById(team_id);
        if (!teamData.team_players_ids.includes(player_id)) {
            return res.status(400).json({ error: "Player not in this team" });
        }

        // Check if user is authorized to remove the player
        if (teamData.team_leader !== user_id) {
            return res.status(400).json({ error: "Not authorized for this action" });
        }

        // Remove player id from team_player_ids
        const updatedTeam = await schema.team.findByIdAndUpdate(
            team_id,
            { $pull: { team_players_ids: player_id } },
            { new: true }
        );

        // Remove team id from team_ids of player
        await schema.player.findByIdAndUpdate(
            player_id,
            { $pull: { team_ids: team_id } },
            { new: true }
        );

        res.json(updatedTeam);
    } catch (error) {
        console.error('Error removing player from team:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//delete team
router.delete('/deleteTeam', fetchUser, async (req, res) => {
    const { team_id } = req.body;
    const userId = req.user_id;

    try {
        const teamData = await schema.team.findById(team_id);

        if (!teamData) {
            return res.status(404).json({ error: "Team not found" });
        }

        if (!teamData.team_leader.equals(userId)) {
            return res.status(400).json({ error: "Not authorized for this action" });
        }

        await schema.team.deleteOne({ _id: team_id });

        await schema.player.updateMany(
            { team_ids: { $in: [team_id] } },
            { $pullAll: { team_ids: [team_id] } }
        );

        res.status(200).json({ message: "Deleted the team" });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch team by name or user ID
router.post("/fetchTeams", async (req, res) => {
    try {
        const { query } = req.body;

        // Check if the query is a valid ObjectId (user ID)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);

        let teams;

        if (isObjectId) {
            // Fetch teams by team leader's user ID
            teams = await schema.team.find({ _id: query });
        } else {
            // Fetch team by team name
            const teamData = await schema.team.findOne({ team_name: query });
            if (!teamData) {
                return res.status(400).json({ error: "Team not found" });
            }
            teams = [teamData];
        }

        res.json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create tournament
router.post('/createTournament', fetchUser, async (req, res) => {
    try {
        const { tournament_name, sport_type, start_date_time, description } = req.body;
        const userId = req.user_id;

        const CheckTorName = await schema.tournament.exists({ tournament_name: tournament_name })

        if (CheckTorName) {
            return res.status(400).json({ error: "Not a unique tournament name" })
        }

        // Add the organizer's ID as the default match admin
        const document = new schema.tournament({
            tournament_name: tournament_name,
            tournament_status: "upcoming",
            sport_type: sport_type,
            start_date_time: start_date_time,
            description: description,
            organizer_id: userId,
            match_admins: [userId] // Add the organizer as a match admin
        });

        await document.save();
        res.json(document);
    } catch (error) {
        console.error('Error adding tournament:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update tournament
router.put('/updateTournament/:tournamentId', fetchUser, async (req, res) => {
    try {
        const tournamentId = req.params.tournamentId;
        const userId = req.user_id;
        const { tournament_status, start_date_time, description, match_admins } = req.body;
        const MatchAdmins = match_admins;
        const tournament = await schema.tournament.findById(tournamentId);
        var updatedMatchAdmins = [];

        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }

        if (!tournament.organizer_id.equals(userId)) {
            return res.status(401).json({ error: "Not authorized for this action" });
        }

        if (!MatchAdmins.includes(tournament.organizer_id)) {
            updatedMatchAdmins = [...MatchAdmins, tournament.organizer_id];
        }
        if (tournament_status !== "old" && tournament_status !== "ongoing" && tournament_status !== "upcoming") {
            return res.status(400).json({ error: "Invalid tournament status" });
        }
        const updatedTournament = await schema.tournament.findByIdAndUpdate(
            tournamentId,
            {
                tournament_status: tournament_status,
                start_date_time: start_date_time,
                description: description,
                match_admins: updatedMatchAdmins
            },
            { new: true }
        );

        res.status(200).json(updatedTournament);
    } catch (error) {
        console.error('Error updating tournament:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch all tournaments by status
router.get('/fetchTournamentsByStatus/:status', async (req, res) => {
    try {
        const status = req.params.status;

        // Validate the status value
        const validStatuses = ["old", "ongoing", "upcoming"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        // Find tournaments with the specified status
        const tournaments = await schema.tournament.find({ tournament_status: status });

        res.json(tournaments);
    } catch (error) {
        console.error('Error fetching tournaments by status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch a tournament by name or ID
router.post('/fetchTournament', async (req, res) => {
    try {
        const query = req.body.query;

        // Check if the input is a valid MongoDB ObjectId
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);
        // check if the query is a tournament status or not 
        const isStatus=/^(old|ongoing|upcoming)$/.test(query)

        let tournament;

        if (isObjectId) {
            tournament = await schema.tournament.findById(query);
        } 
        else if(isStatus){
            tournament=await schema.tournament.find({tournament_status:query})
        }
        else {
            tournament = await schema.tournament.findOne({tournament_name: query});
        }

        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }

        res.json(tournament);
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
        const matchesWithTournament = await schema.match.exists({ tournament: tournamentId });
        if (matchesWithTournament) {
            return res.status(400).json({ error: "Cannot delete tournament with associated matches" });
        }

        await schema.tournament.findByIdAndDelete(tournamentId);

        res.json({ message: "Tournament deleted successfully" });
    } catch (error) {
        console.error('Error deleting tournament:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//create match
router.post('/createMatch', fetchUser, async (req, res) => {
    try {
        const userId = req.user_id;
        const { tournament_id, match_start_date_time, match_end_date_time, description, teams } = req.body;

        // Use findById to find the tournament by its _id
        const tournament = await schema.tournament.findById(tournament_id);

        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }

        if (!tournament.match_admins.includes(userId)) {
            return res.status(401).json({ error: "Not authorized for this action" });
        }

        const matchStartDateTime = new Date(match_start_date_time);
        const matchEndDateTime = new Date(match_end_date_time);

        if (matchStartDateTime <= tournament.start_date_time) {
            return res.status(400).json({ error: "Match start date must be ahead of the tournament start date" });
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
            match_admin: userId
        });

        const createdMatch = await newMatch.save();

        res.status(200).json(createdMatch);
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
            oldMatch.match_start_date_time=updatedMatchStartDateTime;
            if (match_end_date_time) {
                const updatedMatchEndDateTime = new Date(match_end_date_time);   
                if (updatedMatchEndDateTime <= updatedMatchStartDateTime) {
                    return res.status(400).json({ error: "Match end date must be after the start date" });
                }
                oldMatch.match_end_date_time=updatedMatchEndDateTime;
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

//fetch matches of a tournament
router.post('/fetchTournamentMatches', async (req, res) => {
    try {
        const { tournament_id } = req.body
        const matches = await schema.match.find({ tournament_id: tournament_id })
        if (!matches || matches.length === 0) {
            res.status(404).json({ error: "tournament matches not found" })
        }
        res.status(200).json(matches)
    } catch (error) {

    }
});

//fetch match by id
router.get('/fetchMatchById/:matchId', async (req, res) => {
    try {
        const matchId = req.params.matchId;
        const matchData = await schema.match.findById(matchId);

        if (!matchData) {
            return res.status(404).json({ error: "Match not found" });
        }

        res.status(200).json(matchData);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
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