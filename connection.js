const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic')

// mongodb connect
mongoose.connect('mongodb://root:123123@localhost:27017/upwork?authSource=admin');

const JobSchema = new mongoose.Schema({
    title: String,
    createdOn: Date,
    type: Number,
    ciphertext: String,
    description: String,
    category2: String,
    subcategory2: String,
    skills: [{
        name: String,
        prettyName: String,
        highlighted: Boolean,
        uid: String
    }],
    duration: String,
    shortDuration: String,
    durationLabel: String,
    engagement: String,
    shortEngagement: String,
    amount: {
        currencyCode: String,
        amount: Number
    },
    recno: Number,
    uid: String,
    client: {
        paymentVerificationStatus: Boolean,
        location: {
            country: String
        },
        totalSpent: Number,
        totalFeedback: Number,
        companyRid: Number,
        companyName: String,
        edcUserId: Number,
        lastContractPlatform: String,
        lastContractRid: String,
        lastContractTitle: String,
        feedbackText: String,
        companyOrgUid: String
    },
    freelancersToHire: Number,
    relevanceEncoded: String,
    enterpriseJob: Boolean,
    tierText: String,
    tier: String,
    tierLabel: String,
    isSaved: Boolean,
    feedback: String,
    proposalsTier: String,
    isApplied: Boolean,
    sticky: Boolean,
    stickyLabel: String,
    jobTs: String,
    prefFreelancerLocationMandatory: Boolean,
    prefFreelancerLocation: [
        String
    ],
    premium: Boolean,
    plusBadge: Boolean,
    publishedOn: Date,
    renewedOn: Boolean,
    sandsService: {
        uid: String,
        shortName: String,
        longName: String
    },
    sandsSpec: {
        uid: String,
        shortName: String,
        longName: String
    },
    sandsAttrs: [],
    occupation: {
        uid: String,
        prefLabel: String
    },
    attrs: [{
        name: String,
        skillType: Number,
        uid: String,
        highlighted: Boolean,
        prettyName: String
    }],
    isLocal: Boolean,
    workType: String,
    locations: []

}, {
    collection: 'job'
});

JobSchema.plugin(mongoosastic, {
    "host": "localhost",
    "port": 9200
});

var Job = mongoose.model('job', JobSchema),
    stream = Job.synchronize(),
    count = 0;

stream.on('data', function (err, doc) {
    count++;
});
stream.on('close', function () {
    console.log('indexed ' + count + ' documents!');
});
stream.on('error', function (err) {
    console.log(err);
});

Job.createMapping((err, mapping) => {
    console.log('mapping created');
});

module.exports = Job;