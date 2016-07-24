import Bitly from 'bitly';
import bitlyConf from '../config'

export const bitly = new Bitly(bitlyConf.apikey);