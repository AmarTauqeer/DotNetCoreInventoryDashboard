using DotNetCoreInventoryDashboard.dtos.PurchaseDetail;
using DotNetCoreInventoryDashboard.models;

namespace DotNetCoreInventoryDashboard.interfaces
{
    public interface IPurchaseDetail
    {
        Task<List<PurchaseDetail>> GetAllAsync();
        Task<PurchaseDetail?> GetByIdAsync(int id);
        Task<PurchaseDetail> CreateAsync(PurchaseDetail purchaseDetail);
        Task<PurchaseDetail> UpdateAsync(int id, CreateUpdatePurchaseDetailDto createUpdatePurchaseDetailDto);
        Task<PurchaseDetail?> DeleteAsync(int id);
    }
}
