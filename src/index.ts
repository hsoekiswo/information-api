import { Hono } from 'hono';
import monsters from './monsters';
import drops from './drops';
import items from './items';
import maps from './maps';
import experiences from './experiences';

const app = new Hono();

app.get('/', (c) => {
  return c.text("Hello this is mini Ragnarok monsters database api for learning!")
})

app.route('/monsters', monsters);
app.route('/drops', drops);
app.route('/items', items);
app.route('/maps', maps);
app.route('/experiences', experiences);

export default app
