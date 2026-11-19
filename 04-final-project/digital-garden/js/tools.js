// ToolManager keeps track of the selected action (plant / water / clear).
class ToolManager {
  constructor() {
    this.tools = [
      { id: "plant", key: "p", label: "Plant", icon: "tools/bundle" },
      { id: "water", key: "w", label: "Water", icon: "tools/watercan" },
      { id: "clear", key: "c", label: "Clear / Collect", icon: "tools/shovel" },
    ];
    this.current = "plant";
  }

  // tool that is selected right now
  get active() {
    return this.tools.find((t) => t.id === this.current);
  }

  // returns true if the key matched a tool.
  select(key) {
    const tool = this.tools.find((t) => t.key === key.toLowerCase());
    if (!tool) return false;
    this.current = tool.id;
    return true;
  }
}
