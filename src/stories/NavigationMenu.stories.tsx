import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuContent,
} from "../components/navigation-menu";

const meta: Meta<typeof NavigationMenu> = {
  title: "Components/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Top-of-page navigation with hover-triggered mega-menu content. Compound API: `<NavigationMenu>` + `<NavigationMenuList>` + `<NavigationMenuItem>` + `<NavigationMenuTrigger>` / `<NavigationMenuLink>` + `<NavigationMenuContent>`.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[420px] flex items-start justify-center pt-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[480px] grid-cols-2 gap-2">
              {[
                {
                  label: "Components",
                  desc: "55 production-ready primitives.",
                },
                {
                  label: "Templates",
                  desc: "Ready-to-ship app shells.",
                },
                {
                  label: "Themes",
                  desc: "Drop-in zinc palettes.",
                },
                {
                  label: "Marketplace",
                  desc: "Community plugins.",
                },
              ].map((item) => (
                <li key={item.label}>
                  <NavigationMenuLink href="#" className="py-2.5 space-y-1">
                    <span className="block text-sm font-medium text-zinc-900">
                      {item.label}
                    </span>
                    <span className="block text-xs font-normal text-zinc-500">
                      {item.desc}
                    </span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[280px] gap-1">
              <li>
                <NavigationMenuLink href="#">
                  Docs
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  Changelog
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  Blog
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" active>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
