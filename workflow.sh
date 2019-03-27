#! /bin/bash

# Git create or checkout branch shortcut
function switch() {
    git checkout $1 2>/dev/null || git checkout -b $1;
}

# Starting from the last successfully built commit hash, check out
# that hash, do the whole thing, rinse and repeat until we've done all the
# commits.

# Set up global git config
git config --global user.email "nick.vanpraet@dropsolid.com"
git config --global user.name "Nick Vanpraet"

# Setup the public repo
echo "Setting up public repo"
cd /builds/dropsolid/
git clone git@git.drupal.org:project/dropsolid_rocketship.git public-skeleton

# Start looping
cd /builds/dropsolid/rocketship
echo "Start looping"
echo "-----------------------------------"
for commit in $(git rev-list --reverse $CI_COMMIT_SHA...$CI_COMMIT_BEFORE_SHA)
do
    echo "Checking out $commit"
    git checkout $commit
    # Grab commit info
    AUTHOR_NAME=$(git log -1 --pretty=format:'%an')
    AUTHOR_EMAIL=$(git log -1 --pretty=format:'%ae')
    COMMIT_MESSAGE=$(git log -1 --format=%s)
    # Check if this commit happened on a supported branch
    echo "Checking if this commit happened on a supported branch."
    if ! [[ "$COMMIT_MESSAGE" =~ ^\[\((8\.[0-9]+\.x)\)\](.*)$ ]] ; then
        # This commit was *not* made on one of the supported branches
        echo "Did not match any supported branches. Entering next loop."
        continue
    fi
    branch="${BASH_REMATCH[1]}"
    # Get raw commit message
    RAW_COMMIT_MESSAGE="${BASH_REMATCH[2]}"
    # Strip leading space
    RAW_COMMIT_MESSAGE="$(echo -e "${RAW_COMMIT_MESSAGE}" | sed -e 's/^[[:space:]]*//')"
    echo "We are a go for this commit, $branch is supported"
    # Go to other repo, checkout head of this branch
    echo "Resetting other repo"
    cd /builds/dropsolid/public-skeleton
    switch "$branch"
    # Go back to clean
    cd /builds/dropsolid/rocketship
    # Sync files
    echo "Syncing files"
    cd /builds/dropsolid/
    rsync -rq --del --exclude 'CHANGELOG.md' --exclude 'bash' --exclude '.git' --exclude 'ci' --exclude 'etc/drush' --exclude 'etc/.gitignore' --exclude '.gitlab-ci.yml' --exclude 'infra.yml' rocketship/ public-skeleton/
    cd public-skeleton
    # If something is different, add the message and author to a list
    echo "Checking if there is something different"
    if ! git diff-index --quiet HEAD --; then
        echo "Committing changes: $AUTHOR_NAME <$AUTHOR_EMAIL> - $COMMIT_MESSAGE"
        git add .
        # Commit as author
        GIT_COMMITTER_NAME="$AUTHOR_NAME" GIT_COMMITTER_EMAIL="$AUTHOR_EMAIL" git commit --author="$AUTHOR_NAME <$AUTHOR_EMAIL>" -m "$RAW_COMMIT_MESSAGE"
        echo "Pushing to $branch"
        git push origin "$branch"
    fi
    # Reset git again before checking out the next commit
    echo "Resetting to $commit"
    cd /builds/dropsolid/rocketship
    git add .
    git reset --hard $commit
    echo "-----------------------------------"
done

echo "Finished the loop."