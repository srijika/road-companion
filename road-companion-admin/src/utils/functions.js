

export const getTitleImage = (name) => {
    let nameTokens = name.split(' ');
    nameTokens = nameTokens.map((nameToken) => {
       return nameToken.substr(0,1).toUpperCase()+nameToken.substr(1);
    })
    return nameTokens.join(' ');
}