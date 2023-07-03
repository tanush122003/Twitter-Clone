const bcrypt =  require('bcryptjs');

// hashing utility function
const hashPassword = async(password)=>
{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt)
    
    // returnin the hashed password
    return hash;
}

// authentication
const matchPassword = (password,hashedPassword)=>
{
    return bcrypt.compare(password,hashedPassword);
}

module.exports = {hashPassword,matchPassword}