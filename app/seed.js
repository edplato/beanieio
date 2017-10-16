// seed.js is for seeding the database with mock data to work with in the interface


// import mongoose and User, Entry, Journal schema
const { User, Entry, Journal } = require('./models/models.js');
const ObjectId = require('mongoose').Types.ObjectId;

// seed data for journals to populate host journals
const journalData = [
{ "userId" : "59e5025b4b83c80012ae1d56", "datetime" : "2017-10-16T05:10:46.745Z", "text" : "", "sentimentScore" : -0.400000011920929, "sentimentMagnitude" : 0.299999988079071 },
{ "userId" : "59e5025b4b83c80012ae1d56", "datetime" : "2017-10-16T05:10:46.745Z", "text" : "", "sentimentScore" : -0.800000011920929, "sentimentMagnitude" : 0.699999988079071 },
{ "userId" : "59e5025b4b83c80012ae1d56", "datetime" : "2017-10-16T05:10:46.745Z", "text" : "", "sentimentScore" : 0.500000011920929, "sentimentMagnitude" : 0.699999988079071 },
{ "userId" : "59e5025b4b83c80012ae1d56", "datetime" : "2017-10-17T05:10:46.745Z", "text" : "", "sentimentScore" : -0.200000011920929, "sentimentMagnitude" : 0.699999988079071 },
{ "userId" : "59e5025b4b83c80012ae1d56", "datetime" : "2017-10-17T05:10:46.745Z", "text" : "", "sentimentScore" : -0.400000011920929, "sentimentMagnitude" : 0.699999988079071 },
{ "userId" : "59e5025b4b83c80012ae1d56", "datetime" : "2017-10-18T05:10:46.745Z", "text" : "", "sentimentScore" : 0.199999988079071, "sentimentMagnitude" : 0.699999988079071 },
{ "userId" : "59e5025b4b83c80012ae1d56", "datetime" : "2017-10-19T05:10:46.745Z", "text" : "", "sentimentScore" : 0.699999988079071, "sentimentMagnitude" : 0.400000011920929 },
{  "userId" : "59e5025b4b83c80012ae1d56", "datetime" : "2017-10-20T05:10:46.745Z", "text" : "", "sentimentScore" : 0.400000011920929, "sentimentMagnitude" : 0.400000011920929 },
{ "userId" : "59e5025b4b83c80012ae1d56", "datetime" : "2017-10-21T05:10:46.745Z", "text" : "", "sentimentScore" : 0.300000011920929, "sentimentMagnitude" : 0.300000011920929 },
{ "userId" : "59e5025b4b83c80012ae1d56", "datetime" : "2017-10-22T05:10:46.745Z", "text" : "", "sentimentScore" : 0.899999988079071, "sentimentMagnitude" : 0.899999988079071 }
];

const seedJournalDB = () => {
  // remove journals from database to start
  Journal.remove({}, (err) => {
    if(err) {
      console.log(err);
    } else {
      // iterate over mock journals, format, and save each journal into the database
      journalData.forEach((journal) => {
        // reformat data to strings for parsing before saving
        let reformatJournal = JSON.stringify(journal);
        let newJournal = new Journal(JSON.parse(reformatJournal));
        newJournal.save((err) => {
          if(err) {
            console.log(err);
          }
        })
      })
    }
  })
  console.log('DATABASE SEEDED');
}

module.exports = seedJournalDB;
