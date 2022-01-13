const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
				"@primary-color": "rgba(252, 184, 0, 1)",                        
				"@link-color": "rgba(252, 184, 0, 1)",
				"@error-color": "#f14705",
				"@box-shadow-base": "0 2px 8px rgba(190, 52, 39, .15)",
				"@input-hover-border-color": "#d9d9d9",
				"@success-color": "#690",                      
				"@warning-color": "rgba(252, 184, 0, 1)",
				"@font-size-base": "14px",                          
				"@heading-color": "rgba(0, 0, 0, .85)",             
				"@text-color": "rgba(0, 0, 0, .75)",                 
				"@text-color-secondary" : "rgba(0, 0, 0, .45)",      
				"@disabled-color" : "rgba(0, 0, 0, .25)",            
				"@border-radius-base": "4px",                        
				"@border-color-base": "#d9d9d9",                     
				"@box-shadow-base": "0 2px 8px rgba(0, 0, 0, .15)",
			},
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
