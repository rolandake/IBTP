// authController.js
import User from './userModel.js';
import bcrypt from 'bcrypt';

export const inscription = async (req, res) => {
  try {
    const { nom, email, motDePasse } = req.body;
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const nouvelUtilisateur = new User({ nom, email, motDePasse: hashedPassword });
    await nouvelUtilisateur.save();
    res.status(201).json({ message: 'Utilisateur inscrit avec succès !' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’inscription.', error });
  }
};

export const connexion = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const utilisateur = await User.findOne({ email });
    if (!utilisateur) return res.status(401).json({ message: 'Email incorrect.' });

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) return res.status(401).json({ message: 'Mot de passe incorrect.' });

    res.status(200).json({ message: 'Connexion réussie.', utilisateur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion.', error });
  }
};
