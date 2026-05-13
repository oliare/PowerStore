using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PowerStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDuplicateField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discount",
                table: "Products");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Discount",
                table: "Products",
                type: "numeric",
                nullable: true);
        }
    }
}
