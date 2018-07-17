
const sequelizeConfig = {
  database: 'test',
  username: 'postgres',
  password: 'Q@wertyuiop',
  dialect: 'postgres',
  host: 'localhost',
};


// TESTS
const newImage = (num, cat) => {
  return {
    title: num,
    postLink: num,
    extension: num,
    hash: num,
    category: cat,
  };
};

const seedData = [
  newImage('1', '1'),
  newImage('2', '1'),
  newImage('3', '1'),
  newImage('4', '2'),
  newImage('5', '2'),
  newImage('6', '2'),
  newImage('7', '2'),
  newImage('8', '2'),
];



export { sequelizeConfig, seedData };
