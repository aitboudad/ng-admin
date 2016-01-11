export function templateProvider(viewName, defaultView) {
    return ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
        var customTemplate;
        var view = Configuration().getViewByEntityAndType($stateParams.entity, viewName);
        customTemplate = view.template();
        if (customTemplate) {
            return customTemplate;
        }
        customTemplate = Configuration().customTemplate()(viewName);
        if (customTemplate) {
            return customTemplate;
        }
        return defaultView;
    }];
}

export function viewProvider(viewName) {
    return ['$stateParams', 'NgAdminConfiguration', function ($stateParams, Configuration) {
        var view;
        try {
            view = Configuration().getViewByEntityAndType($stateParams.entity, viewName);
        } catch (e) {
            var error404 = new Error('Unknown view or entity name');
            error404.status = 404; // trigger the 404 error
            throw error404;
        }
        if (!view.enabled) {
            throw new Error('The ' + viewName + ' is disabled for this entity');
        }
        return view;
    }];
}
