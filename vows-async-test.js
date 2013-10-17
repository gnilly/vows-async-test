var vows = require('vows'),
    assert = require('assert'),
    ws = require('ws');


vows.describe('The Good Things').addBatch({
    'async': {
        topic: function () {
            var topic = this;
            this.wss = new ws('ws://echo.websocket.org');

            setTimeout(function () {
                topic.callback(null, topic);
            }, 1000);
        },

        'connected': function (err, topic) {
            assert.equal(topic.wss.readyState, ws.OPEN);
        },

        'disconnected on timeout': {
            topic: function (parentTopic) {
                var topic = this;
                topic.wss = parentTopic.wss;
                setTimeout(function () {
                    topic.wss.close();
                }, 900);
                setTimeout(function () {
                    topic.callback(null, topic);
                }, 1000);
            },

            'disconnected': function (err, topic) {
                assert.notEqual(topic.wss.readyState, ws.OPEN);
            },

            'wait 0 sec and check again': {
                topic: function (parentTopic) {
                    var topic = this;
                    topic.wss = parentTopic.wss;
                    setTimeout(function () {
                        topic.callback(null, topic);
                    }, 0);
                },

                'disconnected 2': function (err, topic) {
                    assert.notEqual(topic.wss.readyState, ws.OPEN);
                }
            }

        }

    }
}).export(module);