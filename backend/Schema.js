const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_email: { type: String, required: true, unique: true },
    user_pwd: String,
    user_role: [String]
})
const user = mongoose.model('user', userSchema);

const playerSchema = new mongoose.Schema({
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
})

const player = mongoose.model('player', playerSchema)

const teamSchema = new mongoose.Schema({
    team_leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    team_name: String,
    team_players_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'player' }]
})

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
    },
    match_status:{
        type:String,
        required:true
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

const dataPointsSchema = new mongoose.Schema({
    tournament_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tournament',
        required: true
    },
    performance_metrics: [String]
});

const dataPoints = mongoose.model('dataPoints', dataPointsSchema);

const performanceRecordSchema = new mongoose.Schema({
    tournament_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tournament',
        required: true
    },
    player_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'player',
        required: true
    },
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team',
        required: true
    },
    match_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'match',
        required: true
    },
    performance_metrics: {
        type: Map,
        of: String,
        required: true
    },
});

const performanceRecord = mongoose.model('performanceRecord', performanceRecordSchema);

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receivers: {
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
        players: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'player'
        }],
        teams: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'team'
        }],
        matches: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'match'
        }],
        tournaments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tournament'
        }],
    },
    message: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        require: true
    },
    read: {
        type: Boolean,
        default: false
    }
});

const notification = mongoose.model('notification', notificationSchema);

module.exports = {
    user,
    player,
    team,
    match,
    tournament,
    dataPoints, 
    performanceRecord,
    notification
}