SHELL := bash

src := lazyfill.api.js
samples := $(shell ls samples/*.tamper.js)
VERSION := $(shell grep "this.VERSION" lazyfill.api.js | grep -oE "([0-9\.]{2,})")
unstaged_src_changes := $(shell git status | grep $(src) | wc -l | tr -d ' ')
staged_sample_changes := "shell git diff --cached | wc -l | tr -d ' '"
GIT_CDN_URL := "https://cdn.rawgit.com/tunnelshade/lazyfill/$(COMMIT_HASH)/$(src)#sha256=$(SHA256_FILE_HASH)"

define git_cdn
https://cdn.rawgit.com/tunnelshade/lazyfill/$(2)/$(1)#sha256=$(3)
endef

.PHONY: check_version_bump

check_version_bump:
	@echo "Release Version: $(VERSION)"
	@read -p "Press Enter to continue..."

version_bump: check_version_bump
	@echo "Releasing a new version"
ifneq ("$(unstaged_src_changes)", "0")
	git add $(src)
	git commit -m "Version bump to $(VERSION)"
endif

update_samples: $(samples)
	$(eval COMMIT_HASH=`git rev-parse HEAD`)
	$(eval SHA256_FILE_HASH=`openssl dgst -sha256 -binary $(src) | openssl base64 -A`)
	$(shell sed -i "s;^// @require .*lazyfill\.api\.js.*;// @require $(call git_cdn,$(src),$(COMMIT_HASH),$(SHA256_FILE_HASH));g" $(samples))

commit_samples: $(samples)
	git reset
	git add $(samples)
ifneq ($(staged_sample_changes), 0)
	git commit -m "Updating sameples for $(VERSION)"
endif


release: version_bump update_samples commit_samples
