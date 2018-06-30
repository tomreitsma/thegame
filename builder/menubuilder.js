menubuilder = {
    createMenu: function(options) {
        return new Menu(options);
    }
}

Menu = function(options) {
    Object.extend(this, options);
    this.init();
}

Menu.prototype = {
    selectedTool: null,
    
    init: function() {
        main.loadCSS('builder/styles/builder.css');
    },
    
    setup: function() {
        div = $.createElement('div');
        div.id = 'toolsMenu';
        div.class = 'menu'
        div.style.position = 'fixed';
        div.style.top = '50px';
        div.style.left = '10px';
        
        tools.each(this.tools.categories, function(category, key){
            span = $.createElement('span');
            span2 = $.createElement('p');
            span2.innerHTML = category.name;
            span.appendChild(span2);
            
            span.onclick = function(key) {
                this.selectCategory(key);
            }.bind(this, key);
            
            div.appendChild(span);
        }.bind(this));
        
        selectContainer = $.createElement('div');
        selectContainer.id = 'selectContainer';
        div.appendChild(selectContainer);
        
        $.body.appendChild(div);
        
        if(_dc = this.tools._defaultCategory) this.selectCategory(_dc);
        if(_dt = this.tools._defaultTool) this.selectTool(this.tools.items[_dc][_dt]);
    },
    
    destroy: function() {
        console.log('destroying');
        $.html.removeChild($.byId('toolsMenu'));
        console.log('destroyed!')
    },
    
    selectCategory: function(category) {
        $.byId('selectContainer').innerHTML = '';
        select = $.createElement('select');
        
        tools.each(this.tools.items[category], function(tool) {
            option = $.createElement('option');
            option.value = this.tools.resourceMap[tool.resource];
            option.style.background = 'url("app/images/'+option.value+'") no-repeat scroll 0% 0% transparent';
            option.style.paddingLeft = '40px';
            option.style.width = '100px';
            option.style.height = '40px';
            
            option.innerHTML = tool.name;
            option.tool = tool;
            select.appendChild(option);
        }.bind(this));
        
        e = new eventhandler(select);
        e.subscribe('onchange', function(event){
            i = event.target.selectedIndex;
            tool = event.target.options[i].tool;
            this.selectTool(tool);
        }.bind(this));
        
        $.byId('selectContainer').appendChild(select);
    },
    
    selectTool: function(tool) {
        this.selectedTool = tool;
    },
    
    getSelectedTool: function() {
        return this.selectedTool;
    }
}
