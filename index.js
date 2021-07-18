const core = require('@actions/core');
const github = require('@actions/github');

const validEvent = ['pull_request'];


/**
 * @param {Object} spec
 * @param {string} branch 
 * @returns {string}
 */
const getSpecKey = (spec, branch) =>
    Object.keys(spec).find((target) => RegExp(target).test(branch));


async function run() {
    try {

        const { eventName, payload: { pull_request } } = github.context

        core.info(`Event name: ${eventName}`);
        if (validEvent.indexOf(eventName) < 0) {
            core.setFailed(`Invalid event: ${eventName}`);
            return;
        }

        const baseBranch = pull_request.base.ref;

        const ignore = core.getMultilineInput('ignore');
        core.debug(`ignore : ${ignore}`);
        if (ignore.length > 0 && ignore.some((el) => baseBranch === el)) {
            core.info(`Skipping checks since ${baseBranch} is in the ignored list - ${ignore}`);
            return
        }

        const specStr = core.getInput('spec');
        core.debug(`spec: ${specStr}`);
        const spec = JSON.parse(specStr);

        core.debug(`spec: ${spec}`);
        var specKey = getSpecKey(spec, baseBranch);

        if (specKey == null) {
            core.info(`Skipping cheks since ${baseBranch} is not found`);
            return;
        }


        const branch = pull_request.head.ref;

        const specValor = spec[specKey];

        let isCorrect = false;
        if (Array.isArray(specValor)) {
            isCorrect = specValor.some(valor => branch.match(valor));
        } else {
            isCorrect = specValor.match(valor);
        }


        if (isCorrect) {
            core.setFailed(`Your branch is not allowed to PR into ${branch}`);
            return
        }


    } catch (error) {
        core.setFailed(error.menssage);
    }
}



run();
