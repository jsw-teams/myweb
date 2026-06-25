(function () {
  var sections = [
    { name: "home", description: "JS.Gripe public home page.", url: "/" },
    { name: "projects", description: "Public project index.", url: "/projects/" },
    { name: "writing", description: "Recent writing and blog entry point.", url: "/writing/" },
    { name: "friends", description: "Public friend links.", url: "/friends/" },
    { name: "contact", description: "Public contact options.", url: "/contact/" },
    { name: "privacy", description: "Privacy policy.", url: "/privacy/" }
  ];

  function absolute(path) {
    return new URL(path, window.location.origin).href;
  }

  function listSiteSections() {
    return Promise.resolve({
      sections: sections.map(function (section) {
        return {
          name: section.name,
          description: section.description,
          url: absolute(section.url)
        };
      })
    });
  }

  function listDiscoveryResources() {
    return Promise.resolve({
      resources: [
        "/.well-known/api-catalog",
        "/.well-known/agent-skills/index.json",
        "/.well-known/mcp/server-card.json",
        "/.well-known/oauth-protected-resource",
        "/auth.md",
        "/llms.txt",
        "/llms-full.txt"
      ].map(absolute)
    });
  }

  function setupWebMcp() {
    var tools = [
      {
        name: "list_site_sections",
        title: "List site sections",
        description: "List public JS.Gripe sections and canonical URLs.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false
        },
        annotations: { readOnlyHint: true },
        execute: listSiteSections
      },
      {
        name: "list_discovery_resources",
        title: "List discovery resources",
        description: "List machine-readable discovery resources published by this site.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false
        },
        annotations: { readOnlyHint: true },
        execute: listDiscoveryResources
      }
    ];
    var registered = false;

    try {
      if (document.modelContext && typeof document.modelContext.registerTool === "function") {
        tools.forEach(function (tool) {
          document.modelContext.registerTool(tool);
        });
        registered = true;
      }
    } catch (error) {
      registered = false;
    }

    try {
      if (navigator.modelContext && typeof navigator.modelContext.provideContext === "function") {
        navigator.modelContext.provideContext({
          name: "js-gripe",
          description: "Public JS.Gripe discovery tools.",
          tools: tools
        });
        registered = true;
      }
    } catch (error) {
      registered = false;
    }

    window.JSGripeWebMcpReady = registered;
  }

  setupWebMcp();
})();
