const mongoose = require('mongoose');

const userSchema = {
    user_email: String,
    user_pwd: String,
    user_role: [String]
}
const user = mongoose.model('user', userSchema);

const playerSchema = {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    player_name: String,
    player_dob: Date,
    team_ids: [{
        type: mongoose.Schema.Types.ObjectId
        , ref: 'team'
    }]
}

const player = mongoose.model('player', playerSchema)

const teamSchema = {
    team_leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    team_name: String,
    team_players_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'player' }]
}

const team = mongoose.model('team', teamSchema)

const matchSchema = new mongoose.Schema({
    tournament_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tournament',
        required: true
    },
    match_start_date_time: {
        type: Date,
        required: true
    },
    match_end_date_time: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team',
        required: true
    },
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team',
        required: true
    }],
    OLC: {
        type: String,
        required: true
    }
});

const match = mongoose.model('match', matchSchema)

const tournamentSchema = new mongoose.Schema({
    tournament_name: String,
    tournament_status: String,
    sport_type: String,
    start_date_time: Date,
    description: String,
    organizer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    match_admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
})

const tournament = mongoose.model('tournament', tournamentSchema)

const performanceSchema = new mongoose.Schema({
    tournament_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tournament',
        required: true
    },
    team_metrics: [String],
    player_metrics: [String]
});


const performance = mongoose.model('performance', performanceSchema); 

module.exports = {
    user,
    player,
    team,
    match,
    tournament,
    performance
}