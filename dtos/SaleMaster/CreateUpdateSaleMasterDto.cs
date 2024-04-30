namespace DotNetCoreInventoryDashboard.dtos.SaleMaster
{
    public class CreateUpdateSaleMasterDto
    {
        public int SaleAmount { get; set; }
        public int? CustomerId { get; set; }

        public DateTime CreateAt { get; set; }
    }
}
