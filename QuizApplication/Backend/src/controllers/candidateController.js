const Candidate = require('../models/Candidate'); // Ensure the model is correctly imported

const addCandidates = async (req, res) => {
    const { firstName, surName, email, phone, createdAt, systemId,rollNumber } = req.body;

    try {
        const candidateData = new Candidate({
            firstName,
            surName,
            email,
            phone,
            createdAt,
            systemId,
            rollNumber,
        });

        await candidateData.save();
        res.status(201).json('Candidate added successfully');
    } catch (err) {
        console.error(err);
        res.status(500).json('Error occurred while adding Candidate');
    }
};

const getCandidates = async (req, res) => {
    try {
        const candidates= await Candidate.find(); // Fetch all candidates from the database
        res.json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json('Error occurred while fetching Candidates');
    }
}

const deleteCandidate=async(req,res)=>{
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Candidate ID is required' });
        }

        const candidate = await Candidate.findByIdAndDelete(id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error occurred while deleting Candidate' });
    }
}

module.exports = { addCandidates ,getCandidates,deleteCandidate};
