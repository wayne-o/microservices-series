'use strict';
const k8s = require('@pulumi/kubernetes');
const pulumi = require('@pulumi/pulumi');
const config = new pulumi.Config('twentytwenty');
const namespace = config.require('namespace');

const ns = require('./ns')();
const es = require('./es')();
const vault = require('./vault')();