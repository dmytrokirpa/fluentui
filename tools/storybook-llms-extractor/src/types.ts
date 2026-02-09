/**
 * CLI arguments
 */
export type Args = {
  /**
   * Relative path to the Storybook distribution folder
   * @example `--distPath "storybook-static"`
   */
  distPath: string;
  /**
   * Storybook deployed URL for the summary docs
   * @example `--summaryBaseUrl "https://storybook.fluentui.dev/"`
   */
  summaryBaseUrl: string;
  /**
   * Title for the llms.txt file
   * @example `--summaryTitle "Fluent UI Components and Pages"`
   */
  summaryTitle?: string;
  /**
   * Description for the llms.txt file
   * @example `--summaryDescription "This file contains the LLMs documentation for all components and pages."`
   */
  summaryDescription?: string;
  /**
   * Array of composed Storybook refs.
   * Used to reference external Storybook docs.
   * @example `--refs "{title:'foo', url:'www'}"`
   */
  refs?: StorybookRef[];

  /**
   * An agent skill to generate. If provided, the CLI will generate a SKILL.md file for this skill in the output directory, and include it in the index.json metadata.
   * The skill should follow the specification: https://agentskills.io/specification
   */
  agentSkill?: AgentSkill | undefined;
};

/**
 * Storybook store item, contains component/page metadata and stories.
 */
export type StorybookStoreItem = {
  meta: StorybookStoreItemMeta;
  stories: Record<string, StorybookStoreItemStory>;
};

/**
 * Storybook store item metadata
 */
export type StorybookStoreItemMeta = {
  id: string;
  title: string;
  parameters: {
    fileName: string;
    docs?: {
      description?: {
        component?: string;
        story?: string;
      };
    };
  };
  component?: StorybookComponent;
  subcomponents?: Record<string, StorybookComponent>;
};

/**
 * Storybook store item story, contains story metadata like name, parameters, etc.
 */
export type StorybookStoreItemStory = {
  id: string;
  name: string;
  parameters: {
    docs: {
      description?: {
        component?: string;
        story?: string;
      };
      source?: {
        originalSource?: string;
      };
    };
    /**
     * This field is specific to FluentUI, and provided by the `@fluentui/storybook-addon` package.
     */
    fullSource?: string;
    docsOnly?: boolean;
  };
};

/**
 * Storybook component metadata, contains component name, description, props, etc.
 */
export type StorybookComponent = {
  displayName: string;
  __docgenInfo?: {
    description?: string;
    displayName?: string;
    props?: Record<string, StorybookComponentProp> | null;
  };
};

/**
 * Storybook component prop metadata, contains prop name, description, type, etc.
 */
export type StorybookComponentProp = {
  defaultValue?: { value: string } | string | null;
  description?: string;
  name: string;
  required?: boolean;
  type?: {
    name?: string;
    value?: { value: string }[];
  };
};

/**
 * Composed Storybook ref, used to link to other Storybook docs.
 * see: https://storybook.js.org/docs/sharing/storybook-composition
 *
 * @example
 * ```ts
 * { id: 'charts-v9', title: 'Fluent UI Charts v9', url: 'https://charts.fluentui.dev' }
 * ```
 */
export type StorybookRef = { title: string; url: string; sourceUrl?: string };

/**
 * Agent skill definition following the specification at https://agentskills.io/specification
 */
export type AgentSkill = {
  /**
   * Unique identifier for the skill
   * @see https://agentskills.io/specification#name-field
   */
  name: string;
  /**
   * Description of when and why to use this skill, includes trigger keywords for discovery
   * @see https://agentskills.io/specification#description-field
   */
  description: string;

  /**
   * SKILL.md content, should follow the format described in the specification
   * @see https://agentskills.io/specification#skill-md-format
   */
  content: string;

  /**
   * Optional compatibility information, specifying which agents or environments this skill is compatible with
   * @see https://agentskills.io/specification#compatibility-field
   */
  compatibility?: string;

  /**
   * List of tools allowed to use this skill
   * @see https://agentskills.io/specification#allowedtools-field
   */
  allowedTools?: string[];

  /**
   * Optional license information for the skill's content
   * @see https://agentskills.io/specification#license-field
   */
  license?: string;

  /**
   * Optional metadata for the skill
   * @see https://agentskills.io/specification#metadata-field
   */
  metadata?: Record<string, string>;
};
