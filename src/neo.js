/* globals _DATABASE */
import NeoJS from 'neojs';

const neojs = new NeoJS({ database: _DATABASE, debug: false, fbInstanceId: 'Default' });

const auth = neojs.auth;
const crud = neojs.crud;

export { neojs, auth, crud };
