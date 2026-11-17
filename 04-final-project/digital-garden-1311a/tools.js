// ToolManager: keeps track of the selected action (plant / water / clear).
class ToolManager {
  constructor() {
    this.tools = [
      { id: "plant", key: "p", label: "Plant" },
      { id: "water", key: "w", label: "Water" },
      { id: "clear", key: "c", label: "Clear" },
    ];
    this.current = "plant";
  }

  // Returns true if the key matched a tool.
  select(key) {
    const tool = this.tools.find((t) => t.key === key.toLowerCase());
    if (!tool) return false;
    this.current = tool.id;
    return true;
  }
}
