import type { CollectionConfig } from "payload"

const adminOnly = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const Blooms: CollectionConfig = {
  slug: "blooms",
  admin: {
    useAsTitle: "name",
    group: "Martian installation",
    defaultColumns: ["name", "flowerIndex", "collection", "createdAt"],
    description: "Visitors explicitly share their name and bloom. Birth dates and memories are never stored here.",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.context.floranRegistration),
    update: () => false,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        const registration = req.context.floranRegistration
        if (operation !== "create" || !registration || typeof registration !== "object") {
          throw new Error("Blooms must be shared through the installation.")
        }
        return { ...data, ...registration }
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 40 },
    {
      name: "flowerIndex", type: "number", required: true, min: 0, max: 11,
      validate: (value: unknown) => Number.isInteger(value) || "Choose a valid bloom.",
      access: { create: () => false, update: () => false },
    },
    {
      name: "collection", type: "select", required: true, options: ["mars", "luminous"],
      access: { create: () => false, update: () => false },
    },
    {
      name: "requestKey", type: "text", required: true, unique: true,
      admin: { hidden: true },
      access: {
        read: ({ req }) => Boolean(req.user || req.context.floranRegistrationLookup),
        create: () => false,
        update: () => false,
      },
    },
  ],
}
