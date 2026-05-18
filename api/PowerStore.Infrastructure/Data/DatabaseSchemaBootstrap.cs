using Microsoft.EntityFrameworkCore;

namespace PowerStore.Infrastructure.Data;

public static class DatabaseSchemaBootstrap
{
    private const string MigrationId = "20260517120000_AddRefreshTokens";

    public static async Task EnsureRefreshTokensTableAsync(PowerStoreDbContext db)
    {
    const string createTableSql = """
      CREATE TABLE IF NOT EXISTS "RefreshTokens" (
          "Id" uuid NOT NULL,
          "UserId" uuid NOT NULL,
          "TokenHash" character varying(128) NOT NULL,
          "TokenFamilyId" uuid NOT NULL,
          "CreatedAt" timestamp with time zone NOT NULL,
          "ExpiresAt" timestamp with time zone NOT NULL,
          "RevokedAt" timestamp with time zone NULL,
          "ReplacedByTokenId" uuid NULL,
          "CreatedByIp" text NULL,
          CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("Id"),
          CONSTRAINT "FK_RefreshTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
      );
      """;

    const string createIndexesSql = """
      CREATE UNIQUE INDEX IF NOT EXISTS "IX_RefreshTokens_TokenHash" ON "RefreshTokens" ("TokenHash");
      CREATE INDEX IF NOT EXISTS "IX_RefreshTokens_TokenFamilyId" ON "RefreshTokens" ("TokenFamilyId");
      CREATE INDEX IF NOT EXISTS "IX_RefreshTokens_UserId" ON "RefreshTokens" ("UserId");
      """;

    const string migrationHistorySql = """
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      SELECT {0}, '8.0.25'
      WHERE NOT EXISTS (
          SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = {0}
      );
      """;

        await db.Database.ExecuteSqlRawAsync(createTableSql);
        await db.Database.ExecuteSqlRawAsync(createIndexesSql);
        await db.Database.ExecuteSqlRawAsync(migrationHistorySql, MigrationId);
    }
}
