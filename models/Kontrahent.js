var mongoose = require('mongoose');

var KontrahentSchema = new mongoose.Schema({
  id: Number,
  imie: String,
  nazwisko: String,
  miasto: String,
  
  });

module.exports = mongoose.model('Kontrahent', KontrahentSchema);
