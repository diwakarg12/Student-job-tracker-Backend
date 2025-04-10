const express = require('express');
const userAuth = require('../middlewares/userAuth.middleware');
const Job = require('../models/job.model');
const { applyJob } = require('../utils/apiValidation');

const jobRouter = express.Router();

jobRouter.post('/apply', userAuth, async (req, res) => {
    try {
        console.log('Log1');
        applyJob(req.body);
        const { company, role, salary, location } = req.body;
        const loggedInUser = req.user;
        if (!loggedInUser) {
            return res.status(404).json({ message: 'Unable to get LoggedIn User Data, Please Login Again' });
        }
        console.log('Log2');
        const appliedJob = new Job({
            company: company,
            role: role,
            status: "Applied",
            salary: salary,
            location: location,
            user: loggedInUser._id
        });

        await appliedJob.save();
        console.log('Log3');
        res.status(200).json({ message: `You have SuccessFully Applied to ${company} for ${role} role`, job: appliedJob });

    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    };
});

jobRouter.get('/getAllJobs', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        if (!loggedInUser) {
            return res.status(404).json({ message: 'Unable to get LoggedIn User Data, Please Login Again' });
        }
        const appliedJobs = await Job.find({ user: loggedInUser._id });
        if (!appliedJobs || appliedJobs.length == 0) {
            return res.status(404).json({ message: "You have not Applied to any Job" });
        }

        res.status(200).json({ message: `${loggedInUser.name}, You have ${appliedJobs.length} Applications`, appliedJobs: appliedJobs });

    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    };
});

jobRouter.patch('/updateStatus/:jobId', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const { status } = req.body;
        const jobId = req.params.jobId;
        if (!loggedInUser) {
            return res.status(404).json({ message: 'Unable to get LoggedIn User Data, Please Login Again' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Invalid Applied Job' });
        };

        job.status = status;
        await job.save();

        res.status(200).json({ message: `${loggedInUser.name}, You have updated job Status to ${status}`, job: job });

    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
});

jobRouter.delete('/deleteJobApplication/:jobId', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const jobId = req.params.jobId;

        if (!loggedInUser) {
            return res.status(404).json({ message: 'Unable to get LoggedIn User Data, Please Login Again' });
        };

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job application not found' });
        }
        if (job.user.toString() !== loggedInUser._id.toString()) {
            return res.status(403).json({ message: 'You can only delete your own job applications' });
        }

        const deletedJob = await Job.findByIdAndDelete(jobId);
        res.status(200).json({ message: `${loggedInUser.name}, You have Deleted job with jobId ${jobId}`, deletedJob: deletedJob });

    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    };
});

module.exports = jobRouter;