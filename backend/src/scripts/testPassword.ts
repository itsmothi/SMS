import bcrypt from 'bcrypt';

const testHash = async () => {
    const hash = '$2b$10$4COgzrS/VTJ32dOicy9Q3ekEueNfQ5NKiphmEw0B8IYiITVi4RUmS';
    const isMatch = await bcrypt.compare('admin', hash);
    console.log('Password match:', isMatch);
};

testHash();
