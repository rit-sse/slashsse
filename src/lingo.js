// Description:
//  Look up the definitions of commonly-used phrases within the SSE
//
// Configuration:
//  SSE_API_ROOT - root to the api
//
// Commands:
//  hubot sse lingo list - See all SSE lingo entries
//  hubot sse lingo <phrase> - See the definition of any listed phrases
'use strict';

function sendGetLingoResponse(robot, msg, phrase, Lingo) {
  return Lingo
    .all({ phrase: phrase })
    .then(function handle(res) {
      var returnText = '';

      if (res.body.total === 0) {
        returnText = phrase + ' was not recognized as SSE lingo. Talk to a' +
          ' mentor or SSE officer to have it added! Type `' + robot.alias +
          'sse lingo list` to see all lingo entries.';
      } else {
        var entry = res.body.data[0];
        returnText = entry.phrase + ' -- ' + entry.definition;
      }

      robot.send({ room: msg.envelope.user.name }, returnText);
    });
}

function sendGetLingoListResponse(robot, msg, Lingo) {
  var returnText = 'Use `' + robot.alias + 'sse lingo <phrase>` ' +
  'for a definition of any of the following: ';

  Lingo
    .all({ perPage: 50 })
    .then(function handle(res) {
      var lingos = res.body.data;
      var phrases = lingos.map(function phrase(lingo) {
        return lingo.phrase;
      });

      robot.send({ room: msg.envelope.user.name }, returnText +
        phrases.join(', '));
    });
}

module.exports = function listener(robot) {
  robot.respond(/sse lingo (.+)/i, function handle(msg) {
    var phrase = msg.match[1];
    var Lingo = require('./api')().Lingo;
    if (phrase === 'list') {
      sendGetLingoListResponse(robot, msg, Lingo);
    } else {
      sendGetLingoResponse(robot, msg, phrase, Lingo);
    }
  });
};
