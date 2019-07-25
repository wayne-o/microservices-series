'use strict';

const k8s = require('@pulumi/kubernetes');
const pulumi = require('@pulumi/pulumi');
const config = new pulumi.Config('twentytwenty');
const namespace = config.require('namespace');

module.exports = () => {
    let namespaceResult = new k8s.core.v1.Namespace(namespace, {
        metadata: {
            name: namespace
        }
    });
}