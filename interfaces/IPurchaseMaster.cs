using DotNetCoreInventoryDashboard.dtos.PurchaseMaster;
using DotNetCoreInventoryDashboard.models;

namespace DotNetCoreInventoryDashboard.interfaces
{
    public interface IPurchaseMaster
    {
        Task<List<PurchaseMaster>> GetAllAsync();
        Task<PurchaseMaster?> GetByIdAsync(int id);
        Task<PurchaseMaster> CreateAsync(PurchaseMaster purchaseMaster);
        Task<PurchaseMaster?> UpdateAsync(int id, CreateUpdatePurchaseMasterDto createUpdatePurchaseMasterDto);
        Task<PurchaseMaster?> DeleteAsync(int id);
    }
}
