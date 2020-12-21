export default {
    ADD_VISITED_VIEW: (state, view) => {
        if (state.visitedViews.some(v => v.path === view.path)) {
            return;
        }
        state.visitedViews.push(
            Object.assign({}, view, {
                title: view.meta.title || 'no-name'
            })
        );
    },
    ADD_CACHED_VIEW: (state, view) => {
        if (state.cachedViews.includes(view.name)) {
            return;
        }
        if (!view.meta.noCache) {
            state.cachedViews.push(view.name);
        }
    },

    DEL_VISITED_VIEW: (state, view) => {
        for (const [i, v] of state.visitedViews.entries()) {
            if (v.path === view.path) {
                state.visitedViews.splice(i, 1);
                break;
            }
        }
    },
    DEL_CACHED_VIEW: (state, view) => {
        for (const i of state.cachedViews) {
            if (i === view.name) {
                const index = state.cachedViews.indexOf(i);
                state.cachedViews.splice(index, 1);
                break;
            }
        }
    },

    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
        for (const [i, v] of state.visitedViews.entries()) {
            if (v.path === view.path) {
                state.visitedViews = state.visitedViews.slice(i, i + 1);
                break;
            }
        }
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
        for (const i of state.cachedViews) {
            if (i === view.name) {
                const index = state.cachedViews.indexOf(i);
                state.cachedViews = state.cachedViews.slice(index, index + 1);
                break;
            }
        }
    },

    DEL_ALL_VISITED_VIEWS: state => {
        state.visitedViews = [];
    },
    DEL_ALL_CACHED_VIEWS: state => {
        state.cachedViews = [];
    }
};
