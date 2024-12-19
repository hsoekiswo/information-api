import { Hono } from 'hono';
import monsters from './monsters/index';
import drops from './drops/index';
import items from './items/index';
import maps from './maps/index';
import experiences from './experiences/index';
import { handleError } from './errorHandler';
import summaries from './summaries/index';

const app = new Hono();

app.onError((error, c) => {
  const { status, body } = handleError(error, c);
  return c.json(body, status);
});

app.get('/', (c) => {
  return c.text("Hello this is mini Ragnarok monsters database api for learning!")
})

app.route('/monsters', monsters);
app.route('/drops', drops);
app.route('/items', items);
app.route('/maps', maps);
app.route('/experiences', experiences);
app.route('/summaries', summaries);

export default app
