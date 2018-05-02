const express = require('express');
const bodyParser = require('body-parser');
const jobRouter = express.Router();

const mongoose = require('mongoose');
const Jobs = require('../models/jobs');
const authenticate = require('../authenticate');

jobRouter.use(bodyParser.json());
jobRouter.route('/')
.get((req, res, next) => {
    Jobs.find({})
    .populate('comments.author')
    .then( (jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(jobs);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Jobs.create(req.body)
    .then( (job) => {  
        console.log('job created ', job);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(job);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT is not supported on /jobs');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Jobs.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

//===================================job ID=========================================================

jobRouter.route('/:jobId')
.get( (req, res, next) => {
    Jobs.findById(req.params.jobId)
    .populate('comments.author')
    .then( (job) => {  
        console.log('This is your job: ', job);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(job);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST is not supported on /jobs/' + req.params.jobId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Jobs.findOneAndUpdate(req.params.jobId, {
        $set: req.body
    }, {new: true})
    .then( (job) => {  
        //console.log('This is your job: ', job);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(job);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Jobs.findOneAndRemove(req.params.jobId)
    .then( (resp) => {
        console.log('REMOVED');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = jobRouter;