# Fish completions for dominictarr/readme (npm install readme -g).
#
# Install: put this file to a directory listed in $fish_complete_path.
#

complete -c readme -xa "(ls -1 node_modules ^/dev/null)"
complete -c readme -l help -d "Show help"
complete -c readme -l version -d "Print version"
complete -c readme -l global -d "Show readme for a globally installed module"
complete -c readme -l core -d "Show readme for a core module"
complete -c readme -l web -d "Open project's homepage"
complete -c readme -l github -d "Open project's GitHub page"
complete -c readme -l color -d "Turn on colors"
complete -c readme -l no-color -d "Turn off colors"
