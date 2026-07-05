import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "@/server/auth/validation";

describe("registerSchema", () => {
  const valid = { name: "Alice", email: "alice@example.com", password: "Password1" };

  it("accepts valid input", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(registerSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(registerSchema.safeParse({ ...valid, email: "notanemail" }).success).toBe(false);
  });

  it("rejects short password", () => {
    expect(registerSchema.safeParse({ ...valid, password: "Abc1" }).success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    expect(registerSchema.safeParse({ ...valid, password: "password1" }).success).toBe(false);
  });

  it("rejects password without number", () => {
    expect(registerSchema.safeParse({ ...valid, password: "Password" }).success).toBe(false);
  });

  it("rejects password longer than 72 chars", () => {
    expect(
      registerSchema.safeParse({ ...valid, password: "A1" + "a".repeat(71) }).success
    ).toBe(false);
  });

  it("rejects name longer than 100 chars", () => {
    expect(registerSchema.safeParse({ ...valid, name: "a".repeat(101) }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    expect(
      loginSchema.safeParse({ email: "user@example.com", password: "anypassword" }).success
    ).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(loginSchema.safeParse({ email: "bad", password: "password1" }).success).toBe(false);
  });

  it("rejects short password", () => {
    expect(loginSchema.safeParse({ email: "user@example.com", password: "short" }).success).toBe(
      false
    );
  });
});
