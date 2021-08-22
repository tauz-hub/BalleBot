export default {
    name: 'raw',
    once: false,
    run: (client, dataRaw) => {
        if (dataRaw.t !== "MESSAGE_REACTION_ADD" && dataRaw.t !== "MESSAGE_REACTION_REMOVE") return;


    }
}