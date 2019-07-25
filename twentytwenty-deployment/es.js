'use strict';

const k8s = require('@pulumi/kubernetes');
const pulumi = require('@pulumi/pulumi');
const config = new pulumi.Config('twentytwenty');
const namespace = config.require('namespace');

module.exports = () => {
    let serviceLabels = {
        app: 'es',
        tier: 'data'
    };

    let deployment = new k8s.apps.v1beta1.Deployment('es-deployment', {
        metadata: {
            name: 'es-deployment',
            namespace: namespace,
            labels: serviceLabels
        },
        spec: {
            replicas: 1,
            selector: {
                matchLabels: serviceLabels
            },
            template: {
                metadata: {
                    labels: serviceLabels
                },
                spec: {
                    containers: [
                        {
                            imagePullPolicy: 'IfNotPresent',
                            name: 'elasticsearch',
                            image: `elasticsearch:7.2.0`,
                            env: [{
                                name: 'discovery.type',
                                value: 'single-node'
                            }],

                        }
                    ]
                }
            }
        }
    });

    let service = new k8s.core.v1.Service('es-service', {
        metadata: {
            name: 'es-service',
            namespace: namespace
        },
        spec: {
            selector: serviceLabels,
            type: 'NodePort',
            ports: [
                {
                    port: 9200,
                    targetPort: 9200,
                    protocol: 'TCP',
                    name: 'es-9200'
                },
                {
                    port: 9300,
                    targetPort: 9300,
                    protocol: 'TCP',
                    name: 'es-9300'
                }
            ],
        }
    });
}