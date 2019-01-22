const mongoose = require('mongoose');

// define a schema
const HistoryModelSchema = new mongoose.Schema ({
  player_id: String,
  player_name          : String,
  number_wins      : Number,
  number_games:   Number,

});

// compile model from schema
module.exports = mongoose.model('HistoryModel', HistoryModelSchema);