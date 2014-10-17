var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhaseSchema = new Schema({
    phaseType: { type: String, required: true },
    startDate: { type: Date, required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    endDate: { type: Date }
});

var Phase = mongoose.model('Phase', PhaseSchema);

PhaseSchema.statics.nextPhase = function(phaseId){
	Phase.findOne({_id:phaseId},function(error, doc){
		if(error||doc == null){
			//DO something here?
		}else{
			p = doc.phaseType;
			if (p == 'Applying')
				return 'Interviewing';
			if (p == 'Interviewing')
				return 'Offered';
			if (p == 'Offered')
				return 'Terminated';
			return 'Done';
		}
	});
}

module.exports = Phase;