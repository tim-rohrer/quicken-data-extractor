import * as path from 'path';
import * as dotenv from 'dotenv';
import app from './App';

const dotEnvPath = path.resolve('./.env');
dotenv.config({ path: dotEnvPath });

try {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`server is listening on ${port}`)).on('error', (err) => console.log(err));
} catch (error) {
  throw new Error('Error starting server.');
}
