using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PowerStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSpecificationsField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Specifications",
                table: "Products",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Specifications",
                table: "Products");
        }
    }
}
