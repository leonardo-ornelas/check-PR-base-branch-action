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

        if (validEvent.indexOf(eventName) < 0) {
            core.setFailed(`Invalid event: ${eventName}`);
            return;
        }

        const baseBranch = pull_request.base.ref;
        core.debug(`baseBranch: ${baseBranch}`);

        const ignore = core.getMultilineInput('ignore');
        core.debug(`ignore : ${ignore}`);
        if (ignore.length > 0 && ignore.some((el) => baseBranch === el)) {
            core.info(`Skipping checks since ${baseBranch} is in the ignored list - ${ignore}`);
            return
        }

        const specStr = core.getInput('spec');
        core.debug(`spec: ${specStr}`);

        const spec = JSON.parse(specStr);

        if (specKey == null) {
            core.info(`Skipping cheks since ${baseBranch} is not found`);
            return;
        }

        const branch = pull_request.head.ref;

        const specBranch = spec[specKey];

        let isCorrect = false;
        if (Array.isArray(specBranch)) {
            isCorrect = specBranch.some(b => branch.match(b));
        } else {
            isCorrect = specBranch.match(branch);
        }


        if (!isCorrect) {
            core.setFailed(`Your branch is not allowed to PR into ${baseBranch}`);
            return
        }


    } catch (error) {
        core.setFailed(error.message);
    }
}



run();
