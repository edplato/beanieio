// seed.js is for seeding the database with mock data to work with in the interface


// import mongoose and User, Entry, Journal schema
const { User, Entry, Journal } = require('./models/models.js');
const ObjectId = require('mongoose').Types.ObjectId;

// seed data for journals to populate host journals
const journalData = [
{ "userId" : "59e5217ed2915705c0284463", "datetime" : "2017-10-09T05:10:46.745Z", "text" : "", "sentimentScore" : 0.500000011920929, "sentimentMagnitude" : 0.699999988079071 },
{ "userId" : "59e5217ed2915705c0284463", "datetime" : "2017-10-10T05:10:46.745Z", "text" : "", "sentimentScore" : -0.200000011920929, "sentimentMagnitude" : 0.699999988079071 },
{ "userId" : "59e5217ed2915705c0284463", "datetime" : "2017-10-11T05:10:46.745Z", "text" : "", "sentimentScore" : -0.400000011920929, "sentimentMagnitude" : 0.699999988079071 },
{ "userId" : "59e5217ed2915705c0284463", "datetime" : "2017-10-12T05:10:46.745Z", "text" : "", "sentimentScore" : 0.199999988079071, "sentimentMagnitude" : 0.699999988079071 },
{ "userId" : "59e5217ed2915705c0284463", "datetime" : "2017-10-13T05:10:46.745Z", "text" : "", "sentimentScore" : 0.699999988079071, "sentimentMagnitude" : 0.400000011920929 },
{  "userId" : "59e5217ed2915705c0284463", "datetime" : "2017-10-14T05:10:46.745Z", "text" : "", "sentimentScore" : 0.400000011920929, "sentimentMagnitude" : 0.400000011920929 },
{ "userId" : "59e5217ed2915705c0284463", "datetime" : "2017-10-15T05:10:46.745Z", "text" : "I was feeling kind of down, but hacking made it better. I didn't get much sleep the night before though.", "sentimentScore" : 0.300000011920929, "sentimentMagnitude" : 0.300000011920929 },
{ "userId" : "59e5217ed2915705c0284463", "datetime" : "2017-10-16T05:10:46.745Z", "text" : "My day was great today, I was able to eat lots of bacon! But I also feel a little slow.", "sentimentScore" : 0.899999988079071, "sentimentMagnitude" : 0.899999988079071 }
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
