if ! [ -f ./git ]; then
echo 'git folder exist'
exit;
fi

rm -rf /tmp/shap
git clone http://xziy@git.42team.ru/SailsAdmin/sails-hook-adminpanel.git -b kinza /tmp/shap
cp -r /tmp/shap/.git .
cp /tmp/shap/.gitignore ./.gitignore
