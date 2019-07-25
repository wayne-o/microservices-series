'use strict';

const k8s = require('@pulumi/kubernetes');
const pulumi = require('@pulumi/pulumi');
const config = new pulumi.Config('twentytwenty');
const namespace = config.require('namespace');

module.exports = () => {
    let serviceLabels = {
        app: 'vault',
        tier: 'data'
    };

    let deployment = new k8s.apps.v1beta1.Deployment('vault-deployment', {
        metadata: {
            name: 'vault-deployment',
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
                            name: 'vault',
                            image: `vault`,
                            securityContext: {
                                capabilities: {
                                    add: [
                                        "IPC_LOCK"
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        }
    });

    let service = new k8s.core.v1.Service('vault-service', {
        metadata: {
            name: 'vault-service',
            namespace: namespace
        },
        spec: {
            selector: serviceLabels,
            type: 'NodePort',
            ports: [
                {
                    port: 8200,
                    targetPort: 8200,
                    protocol: 'TCP',
                    name: 'vault-8200'
                }
            ],
        }
    });
}