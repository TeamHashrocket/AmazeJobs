var Phase = require('../models/phase');
var handleError = require('./utils').handleError;

module.exports = {

    // get all phases associated with id
    getAll: function(req, res){
        var applicationId = req.params.id;

        Phase.find({ application: applicationId }, function(err, phases){
            if (err) return handleError(res, 500, err);
            if (phases == undefined) return handleError(res, 404, 'Phases not found');

            res.json({ phases: phases });
        });
    },

    // delete phase
    delete: function(req, res){
        var phaseId = req.params.id;

        Phase.findOne({ _id: phaseId }, function (err, phase) {
            if (err) return handleError(res, 500, err);
            if (phase == undefined) return handleError(res, 404, "Phase not found");

            // remove, not findByIdAndRemove because we have middleware
            phase.remove(function(error) {
                if (err) return handleError(res, 500, err);
                res.json({ success:true });
            });
        });
    }
    
}